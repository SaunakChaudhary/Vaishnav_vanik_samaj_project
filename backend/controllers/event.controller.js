const eventModel = require("../models/event.model");
const eventRegistrationModel = require("../models/event_registration.model");
const path = require("path");
const fs = require("fs");

const addEvent = async (req, res) => {
  try {
    const {
      eventName,
      description,
      lastRegistrationDate,
      eventDateTime,
      location,
      feesPerPerson,
      feesForExtraGuest,
    } = req.body;

    if (
      !eventName ||
      !description ||
      !lastRegistrationDate ||
      !eventDateTime ||
      !location
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const uploadedFile = req.files?.eventPhoto?.[0];

    if (!uploadedFile) {
      return res
        .status(400)
        .json({ error: "No files uploaded or unsupported file type." });
    }
    const documentUrls =
      "/uploads/eventPics/" + uploadedFile.filename;

    const newEvent = await eventModel.create({
      eventName,
      description,
      lastRegistrationDate,
      eventDateTime,
      location,
      feesPerPerson,
      feesForExtraGuest,
      eventPhoto: documentUrls,
    });

    return res
      .status(200)
      .json({ message: "Event Created Successfully", event: newEvent });
  } catch (error) {
    return res.status(500).json("Internal Server Error" + error);
  }
};

const displayEvent = async (req, res) => {
  try {
    const events = await eventModel.find();
    if (!events || events.length === 0) {
      return res.status(200).json({ events: [] });
    }
    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await eventModel.findByIdAndDelete(eventId);
    const fileUrl = deletedEvent.eventPhoto;

    const filePath = path.join(__dirname, "..", fileUrl); // relative path to file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.warn(
          "Image removed from DB, but file not deleted from server:",
          err.message
        );
      }
    });
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;
    // Validate required fields
    if (
      !updates.eventName ||
      !updates.description ||
      !updates.lastRegistrationDate ||
      !updates.eventDateTime ||
      !updates.location
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    // ✅ Extract all uploaded files
    const uploadedFile = req.files?.eventPhoto[0];

    if (!uploadedFile) {
      return res
        .status(400)
        .json({ error: "No files uploaded or unsupported file type." });
    }
    const event = await eventModel.findById(eventId);

    const fileUrl = event.eventPhoto;

    const filePath = path.join(__dirname, "..", fileUrl); // relative path to file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.warn(
          "Image removed from DB, but file not deleted from server:",
          err.message
        );
      }
    });
    // Handle file upload if present
    if (req.files && req.files?.eventPhoto[0]) {
      updates.eventPhoto =
        "/uploads/eventPics/" +
        req.files["eventPhoto"][0].filename;
    }

    const updatedEvent = await eventModel.findByIdAndUpdate(eventId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error, error: error.message });
  }
};

const uploadImages = async (req, res) => {
  try {
    const { eventId, gallery } = req.body;

    if (!eventId || !gallery) {
      return res
        .status(400)
        .json({ message: "eventId and gallery are required" });
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imagePaths = req.files.map(
      (file) => "/uploads/gallery/" + file.filename
    );

    if (gallery === "gallery1") {
      event.images1.push(...imagePaths);
    } else {
      event.images2.push(...imagePaths);
    }

    await event.save();

    res.status(200).json({
      message: "Images uploaded and saved successfully",
      imagesUploaded: imagePaths,
      event,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteImages = async (req, res) => {
  try {
    const { eventId, gallery, imageUrls } = req.body;

    if (!eventId || !gallery || !imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).json({
        message: "eventId, gallery, and imageUrls (as an array) are required",
      });
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (gallery === "gallery1") {
      event.images1 = event.images1.filter((img) => !imageUrls.includes(img));
    } else {
      event.images2 = event.images2.filter((img) => !imageUrls.includes(img));
    }

    imageUrls.forEach((imagePath) => {
      const fullPath = path.join(__dirname, "..", imagePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.warn("Error deleting file:", fullPath, err.message);
        }
      });
    });

    await event.save();

    res.status(200).json({
      message: "Images deleted successfully from DB and folder",
      event,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


const eventRegistration = async (req, res) => {
  try {
    const {
      memberId,
      eventId,
      totalPersons,
      amount,
      status,
      transactionId,
      paymentDate,
    } = req.body;

    if (!memberId || !eventId || !totalPersons) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRegistration = await eventRegistrationModel.create({
      member: memberId,
      event: eventId,
      familyInfo: {
        totalPersons: totalPersons,
      },
      payment: {
        amount,
        status,
        transactionId,
        paymentDate,
      },
    });

    return res.status(201).json({
      message: "Event registration successful",
      registration: newRegistration,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error " + error.message,
    });
  }
};

const eventRegistrationMembers = async (req, res) => {
  try {
    const registrations = await eventRegistrationModel
      .find()
      .populate("member")
      .populate("event");

    if (!registrations || registrations.length === 0) {
      return res.status(200).json({ registrations: [] });
    }

    return res.status(200).json({ registrations });
  } catch (err) {
    return res.status(500).json("Internal Server Error" + err);
  }
};

module.exports = {
  addEvent,
  displayEvent,
  deleteEvent,
  updateEvent,
  uploadImages,
  deleteImages,
  eventRegistration,
  eventRegistrationMembers,
};
