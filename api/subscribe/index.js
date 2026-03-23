/**
 * POST /api/subscribe
 * Stores email signups in Azure Table Storage with honeypot + time-based bot protection.
 * Sends SMS notification to owner on each signup.
 */
var crypto = require("crypto");
var { TableClient } = require("@azure/data-tables");
var { SmsClient } = require("@azure/communication-sms");

var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var MIN_SUBMIT_MS = 3000; // 3 seconds minimum between page load and submit
var SMS_FROM = "+18332711500";
var RATE_LIMIT_MAX = 5;       // max submissions per IP per window
var RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour

module.exports = async function (context, req) {
  var connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connStr) {
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: "Server configuration error." },
    };
    return;
  }

  if (!req.body || typeof req.body !== "object") {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: { error: "Request body is required." },
    };
    return;
  }

  var email = (req.body.email || "").trim().toLowerCase();
  var source = req.body.source || "unknown";
  var honeypot = req.body.website || "";
  var timestamp = parseInt(req.body.ts, 10) || 0;
  var now = Date.now();

  // Honeypot check — real users never fill this hidden field
  if (honeypot) {
    context.log.warn("Honeypot triggered, rejecting submission");
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { success: true },
    };
    return;
  }

  // Time-based check — bots submit instantly
  if (timestamp && now - timestamp < MIN_SUBMIT_MS) {
    context.log.warn("Time check failed, rejecting submission");
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { success: true },
    };
    return;
  }

  // Email validation
  if (!email || !EMAIL_RE.test(email)) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: { error: "Please enter a valid email address." },
    };
    return;
  }

  // Hash the IP for abuse tracking (not raw IP)
  var clientIp = req.headers["x-forwarded-for"] || req.headers["x-client-ip"] || "unknown";
  var ipHash = crypto.createHash("sha256").update(clientIp.split(",")[0].trim()).digest("hex").substring(0, 16);

  try {
    var tableClient = TableClient.fromConnectionString(connStr, "subscribers");

    // Rate limiting: check recent submissions from this IP
    var rateKey = "rate-" + ipHash;
    try {
      var rateEntity = await tableClient.getEntity("ratelimit", rateKey);
      var windowStart = new Date(rateEntity.windowStart).getTime();
      var count = rateEntity.count || 0;
      if (Date.now() - windowStart < RATE_LIMIT_WINDOW_MS && count >= RATE_LIMIT_MAX) {
        context.log.warn("Rate limit exceeded for IP hash: " + ipHash);
        context.res = {
          status: 429,
          headers: { "Content-Type": "application/json", "Retry-After": "3600" },
          body: { error: "Too many requests. Please try again later." },
        };
        return;
      }
      // Within window but under limit — increment
      if (Date.now() - windowStart < RATE_LIMIT_WINDOW_MS) {
        await tableClient.upsertEntity({
          partitionKey: "ratelimit",
          rowKey: rateKey,
          windowStart: rateEntity.windowStart,
          count: count + 1,
        });
      } else {
        // Window expired — reset
        await tableClient.upsertEntity({
          partitionKey: "ratelimit",
          rowKey: rateKey,
          windowStart: new Date().toISOString(),
          count: 1,
        });
      }
    } catch (rateErr) {
      // Entity doesn't exist — first request from this IP
      if (rateErr.statusCode === 404) {
        await tableClient.upsertEntity({
          partitionKey: "ratelimit",
          rowKey: rateKey,
          windowStart: new Date().toISOString(),
          count: 1,
        });
      }
      // Other errors — don't block the signup, just log
      else {
        context.log.warn("Rate limit check failed:", rateErr.message);
      }
    }

    var rowKey = crypto.createHash("sha256").update(email).digest("hex");

    await tableClient.upsertEntity({
      partitionKey: "newsletter",
      rowKey: rowKey,
      email: email,
      source: source,
      subscribedAt: new Date().toISOString(),
      ipHash: ipHash,
    });

    // SMS notification to owner (non-blocking — don't fail the signup if SMS fails)
    var acsConn = process.env.ACS_CONNECTION_STRING;
    var notifyPhone = process.env.NOTIFY_PHONE_NUMBER;
    if (acsConn && notifyPhone) {
      try {
        var smsClient = new SmsClient(acsConn);
        await smsClient.send({
          from: SMS_FROM,
          to: [notifyPhone],
          message: "Solace signup: " + email + " (" + source + ")",
        });
      } catch (smsErr) {
        context.log.warn("SMS notification failed:", smsErr.message);
      }
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { success: true },
    };
  } catch (err) {
    context.log.error("Table Storage error:", err.message);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: "Something went wrong. Please try again." },
    };
  }
};
