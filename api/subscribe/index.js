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

  try {
    var tableClient = TableClient.fromConnectionString(connStr, "subscribers");
    var rowKey = crypto.createHash("sha256").update(email).digest("hex");

    // Hash the IP for abuse tracking (not raw IP)
    var clientIp = req.headers["x-forwarded-for"] || req.headers["x-client-ip"] || "unknown";
    var ipHash = crypto.createHash("sha256").update(clientIp.split(",")[0].trim()).digest("hex").substring(0, 16);

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
