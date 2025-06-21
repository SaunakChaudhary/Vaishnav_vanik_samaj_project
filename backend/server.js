const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const PORT = process.env.PORT || 5000;
const app = express();
const dotenv = require("dotenv");
const AdSlot = require("./models/adslot.model.js");
const path = require("path")

dotenv.config();

require("./Scheduler/reminderEvent.js");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function seedSlot() {
  const count = await AdSlot.countDocuments();
  if (count === 0) {
    const sides = ["top", "bottom", "middle"];
    const slots = sides.map((side) => ({
      side,
      isBooked: false,
      pricePerDay: 100, // default price
    }));
    await AdSlot.insertMany(slots);
    console.log("🚀 Ad slots seeded with default prices!");
  } else {
    console.log("✅ Ad slots already exist.");
  }
}

// Import Routes
const authRoutes = require("./routes/auth.routes.js");
const memberRoutes = require("./routes/member.routes.js");
const eventsRoutes = require("./routes/events.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const adRoutes = require("./routes/adslot.routes.js");
const paymentRoutes = require("./routes/payment.routes.js");
const birthdayRoutes = require("./routes/birthday.routes.js");
const donationRoute = require("./routes/donation.routes.js");
const exportRoute = require("./routes/exportRoutes.js");
const meetingRoute = require("./routes/meeting.routes.js");
const announcementRoute = require("./routes/announcements.routes.js");

// Routers
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/advertisement", adRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/birthday", birthdayRoutes);
app.use("/api/donation", donationRoute);
app.use("/api/export", exportRoute);
app.use("/api/meeting", meetingRoute);
app.use("/api/announcements", announcementRoute);

seedSlot();

// connectDB function to connect to MongoDB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening to the PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
