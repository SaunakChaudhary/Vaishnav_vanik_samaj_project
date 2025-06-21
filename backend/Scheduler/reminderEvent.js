const cron = require("node-cron");
const sendMail = require("../helper/sendMail");
const User = require("../models/members.model");
const EventRegistration = require("../models/event_registration.model");
const Event = require("../models/event.model");

cron.schedule("0 10 * * *", async () => {
  console.log("🔔 Running daily reminder email job...");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find();

    for (const event of events) {
      const lastDate = new Date(event.lastRegistrationDate);
      lastDate.setHours(0, 0, 0, 0);

      const diffInDays = Math.ceil((lastDate - today) / (1000 * 60 * 60 * 24));

      if ([3, 2, 1].includes(diffInDays)) {
        const dayLabel =
          diffInDays === 1 ? "tomorrow" : `in ${diffInDays} days`;

        // 🔍 Get already registered members for this event
        const registeredEntries = await EventRegistration.find({
          event: event._id,
        });

        const registeredMemberIds = registeredEntries.map((entry) =>
          entry.member.toString()
        );

        // 🧑‍💻 Get users who are NOT registered
        const unregisteredUsers = await User.find({
          _id: { $nin: registeredMemberIds },
        });

        for (const user of unregisteredUsers) {
          const formattedEventDate = new Date(
            event.eventDateTime
          ).toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          });

          const formattedLastDate = new Date(
            event.lastRegistrationDate
          ).toLocaleDateString("en-US", {
            dateStyle: "long",
          });
          const email = user.email;
          const subject = `⏰ Reminder: "${event.eventName}" registration ends ${dayLabel}`;
          const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Event Reminder Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background-color: #f0f4f8;
      color: #333;
    }

    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .header {
      color: white;
      text-align: center;
      padding: 40px 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      background-color: rgba(0, 0, 0, 0.5);
      display: inline-block;
      padding: 10px 20px;
      border-radius: 8px;
    }

    .body {
      padding: 30px;
    }

    .body h2 {
      font-size: 22px;
      color: #0f172a;
      margin-bottom: 10px;
    }

    .body p {
      font-size: 16px;
      line-height: 1.6;
      margin: 10px 0;
    }

    .event-card {
      margin: 20px 0;
      padding: 20px;
      background-color: #f9fafb;
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
    }

    .event-card p {
      margin: 6px 0;
    }

    .cta-button {
      display: block;
      text-align: center;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      padding: 14px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      margin: 30px auto 0;
      width: fit-content;
    }

    .footer {
      text-align: center;
      font-size: 13px;
      padding: 20px;
      color: #6b7280;
    }

    @media (max-width: 600px) {
      .header h1 {
        font-size: 22px;
      }

      .body h2 {
        font-size: 18px;
      }
    }
  </style>
</head>
<body>

  <div class="wrapper">
    <div class="header">
      <h1>⏳ Last Chance to Register!</h1>
    </div>

    <div class="body">
      <h2>Hello ${user.firstName + " " + user.lastName},</h2>
      <p>
        Just a reminder that registration for the event <strong> ${
          event.eventName
        }</strong> ends ${dayLabel} (${formattedLastDate}).
      </p>
      <p>
        Make sure you don't miss it!
      </p>
      <p>Regards,<br><strong>Vaishnav Vanik Samaaaj Team</strong></p>

      <div class="event-card">
        <p><strong>🎉 Event:</strong> ${event.eventName}</p>
        <p><strong>📍 Location:</strong> ${event.location}</p>
        <p><strong>🗓 Date and Time:</strong> ${formattedEventDate}</p>
        <p><strong>🛑 Registration Deadline:</strong>${formattedLastDate}</p>
      </div>

      <p style="text-align: center;">Secure your spot now before it's too late!</p>

      <a href="" class="cta-button">Register Now</a>
    </div>

    <div class="footer">
      &copy; 2025 Vaishnav Vanik Samaaj. All rights reserved.
    </div>
  </div>

</body>
</html>`;
          await sendMail(email, subject, "", html);
        }

        console.log(
          `📨 Sent ${dayLabel} reminder for event: ${event.eventName} to ${unregisteredUsers.length} user(s)`
        );
      }
    }

    console.log("✅ All eligible reminders sent.");
  } catch (err) {
    console.error("❌ Error while sending reminder emails:", err);
  }
});
