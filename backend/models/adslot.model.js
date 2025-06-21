const mongoose = require("mongoose");

const adSlotSchema = new mongoose.Schema({
  side: {
    type: String,
    enum: ["top", "bottom", "middle"],
    required: true,
    unique: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  pricePerDay: {
    type: Number,
  },
  fromDate: {
    type: Date,
  },
  availableAfter: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  image: {
    type: String,
  },
  adfees_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdvertisementFees",
  },
});

module.exports = mongoose.model("AdSlot", adSlotSchema);
