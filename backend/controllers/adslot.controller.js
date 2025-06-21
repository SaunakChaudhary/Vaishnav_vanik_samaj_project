const AdSlot = require("../models/adslot.model");
const advertisementFees = require("../models/advertisementFees.model");
const path = require("path");
const fs = require("fs");

const book = async (req, res) => {
  const { side, toDate, userId, amount, duration, transactionId } = req.body;

  try {
    const slot = await AdSlot.findOne({ side });
    const today = new Date();
    const userToDate = new Date(toDate);

    if (slot.isBooked && slot.toDate >= today) {
      return res.status(400).json({ message: "Slot not available" });
    }

    const adFees = await advertisementFees.create({
      advetiseLocation: side,
      duration,
      user: userId,
      price: amount,
      transactionId,
      pricePerDay: slot.pricePerDay,
    });

    slot.isBooked = true;
    slot.fromDate = today;
    slot.availableAfter = userToDate;
    slot.user = userId;
    slot.adfees_id = adFees._id;

    await slot.save();
    res.json({ message: "Slot booked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error booking slot" });
  }
};

const available = async (req, res) => {
  try {
    const expectedSlots = ["top", "bottom", "middle"];
    const slotsFromDb = await AdSlot.find();
    const today = new Date();

    // Cleanup expired slots before preparing response
    for (const slot of slotsFromDb) {
      if (slot.isBooked && slot.availableAfter && slot.availableAfter < today) {
        if (slot.image) {
          const fullPath = path.join(__dirname, "..", slot.image);
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.warn("Error deleting file:", fullPath, err.message);
            }
          });
        }
        slot.isBooked = false;
        slot.bookedBy = undefined;
        slot.fromDate = undefined;
        slot.toDate = undefined;
        slot.availableAfter = undefined;
        slot.image = undefined;
        slot.user = undefined;
        await slot.save();
      }
    }

    const updatedSlots = await AdSlot.find();
    const response = expectedSlots.map((side) => {
      const slot = updatedSlots.find((s) => s.side === side);

      if (!slot || !slot.isBooked) {
        return {
          side,
          status: "Available",
          pricePerDay: slot?.pricePerDay || 100,
        };
      } else {
        return {
          side,
          status: "Booked",
          availableAfter: slot.availableAfter || slot.toDate,
          pricePerDay: slot.pricePerDay,
          bookedBy: slot.user || "Unknown",
          image: slot.image || null,
        };
      }
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const adSlots = async (req, res) => {
  try {
    const slots = await AdSlot.find({}, "-__v");
    return res.json({ success: true, slots });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const setSlots = async (req, res) => {
  const { side, pricePerDay } = req.body;

  try {
    const updated = await AdSlot.findOneAndUpdate(
      { side },
      { pricePerDay },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Slot not found" });
    }

    return res.json({ success: true, message: "Price updated", updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const addImages = async (req, res) => {
  try {
    if (!req.files["image"][0].filename) {
      return res
        .status(400)
        .json({ success: false, message: "Image URL required" });
    }

    const findImage = await AdSlot.find({ side: req.params.side });
    if (findImage[0].image) {
      const fullPath = path.join(__dirname, "..", findImage[0].image);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.warn("Error deleting file:", fullPath, err.message);
        }
      });
    }

    const slot = await AdSlot.findOneAndUpdate(
      { side: req.params.side },
      {
        image:
          "/uploads/advertisement_images/" + req.files["image"][0].filename,
      },
      { new: true }
    );

    if (!slot) {
      return res
        .status(404)
        .json({ success: false, message: "Slot not found" });
    }

    return res.json({ success: true, message: "Image added", slot });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error " + err });
  }
};

const getAdvertisementFees = async (req, res) => {
  try {
    const fees = await advertisementFees.find({}).populate("user");
    return res.json({ success: true, fees });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  book,
  available,
  adSlots,
  setSlots,
  addImages,
  getAdvertisementFees,
};
