const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }]
});

module.exports = mongoose.model("Announcement", announcementSchema);