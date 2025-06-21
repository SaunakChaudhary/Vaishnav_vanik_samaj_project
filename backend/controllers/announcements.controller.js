const Announcement = require("../models/announcement.model");
const User = require("../models/members.model");
const sendEmail = require("../helper/sendMail");

const create = async (req, res) => {
  try {
    const { message } = req.body; // ✅ Correctly extract message

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const users = await User.find();

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: "No users found to send announcement" });
    }

    // ✅ Loop through and send email
    for (const user of users) {
      const html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Announcement</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f9fc;
        margin: 0;
        padding: 0;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
      }

      .email-header {
        background-color: #1a73e8;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }

      .email-header h1 {
        margin: 0;
        font-size: 22px;
      }

      .email-body {
        padding: 20px;
        color: #333333;
      }

      .email-body p {
        line-height: 1.6;
        margin: 10px 0;
      }

      .announcement-box {
        background-color: #f1f3f4;
        padding: 15px;
        border-left: 4px solid #1a73e8;
        margin: 20px 0;
        border-radius: 5px;
      }

      .email-footer {
        text-align: center;
        padding: 16px;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>📢 New Announcement</h1>
      </div>

      <div class="email-body">
        <p>Dear <strong>Member</strong>,</p>

        <div class="announcement-box">
          <p>
    ${message}
          </p>
        </div>

        <p><strong>Member Name:</strong>${
          user.firstName + " " + user.lastName
        }</p>
        <p><strong>Profession:</strong>${user.profession}</p>
        <p><strong>Member Since:</strong> ${user.createdAt}</p>
        <p><strong>Date:</strong> ${Date()}</p>

        <p>Warm regards,</p>
        <p><strong>Vaishnav Vanik Samaj Admin Team</strong></p>
      </div>

      <div class="email-footer">
        &copy; 2025 Vaishnav Vanik Samaj · Anand, Gujarat
      </div>
    </div>
  </body>
</html>
    `;
      await sendEmail(user.email, "New Announcement", "", html);
    }

    const announcement = new Announcement({
      message,
      recipients: users.map((u) => u._id),
    });

    await announcement.save();

    res
      .status(201)
      .json({ message: "Announcement sent successfully", announcement });
  } catch (err) {
    console.error("Error sending announcement:", err); // helpful log
    res.status(500).json({ error: "Failed to send announcement" });
  }
};

const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find().populate(
    "recipients",
    "firstName lastName email"
  );
  res.json(announcements);
};

module.exports = { getAnnouncements, create };
