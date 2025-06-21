const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const sendMail = require("../helper/sendMail");

// Create order
router.post("/create-order", async (req, res) => {
  const {
    amount,
    currency = "INR",
    receipt = "receipt_" + Date.now(),
  } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
});

// Verify payment
router.post("/verify-payment", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    email,
    mailPurpose,
    amount,
    name,
  } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
    await sendPaymentEmail(email, name, mailPurpose, {
      amount,
      transactionId: razorpay_payment_id,
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

const sendPaymentEmail = async (email, name, mailPurpose, paymentDetails) => {
  try {
    let Subject;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Confirmation</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 30px;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header img {
      width: 80px;
    }
    .content h2 {
      color: #2e7d32;
    }
    .details-table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }
    .details-table th, .details-table td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      text-align: center;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content">
      <h2>Payment Successful ✅</h2>
      <p>Hi ${name},</p>
      <p>Thank you for your payment! We're thrilled to have you with us. Below are the details of your transaction:</p>

      <table class="details-table">
        <tr>
          <th>Mail Purpose</th>
          <td>${mailPurpose}</td>
        </tr>
        <tr>
          <th>Transaction ID</th>
          <td>${paymentDetails.transactionId}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>${paymentDetails.amount}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>${new Date()}</td>
        </tr>
      </table>

      <p>If you have any questions or need support, feel free to reply to this email or contact us at <a href="mailto:saunakchaudhary0404@gmail.com">saunakchaudhary0404@gmail.com</a>.</p>

      <p>Thank you once again for your trust and support!</p>

      <p>Warm regards,<br><strong>Vaishnav Vanik Samaaj</strong></p>
    </div>
    <div class="footer">
      © 2025 Vaishnav Vanik Samaaj. All rights reserved.
    </div>
  </div>
</body>
</html>`;
    if (mailPurpose === "Donation") {
      Subject = "Thank you for your generous donation to Vaishnav Vanik Samaaj";
    } else if (mailPurpose === "Event Registration") {
      Subject = "Event Registration Confirmation - Vaishnav Vanik Samaaj";
    } else if (mailPurpose === "Advertisement Slot Booking") {
      Subject =
        "Advertisement Slot Booking Confirmation - Vaishnav Vanik Samaaj";
    } else if (mailPurpose === "Membership Payment Success") {
      Subject = "Membership Payment Success - Welcome to Vaishnav Vanik Samaaj";
    }
    await sendMail(email, Subject, "", html);
    console.log("✅ Email sent to", email);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

module.exports = router;
