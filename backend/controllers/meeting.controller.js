const Meeting = require("../models/meeting.model");
const path = require("path");
const fs = require("fs");
const Member = require("../models/members.model");
const sendMail = require("../helper/sendMail");

const upload = async (req, res) => {
  try {
    const meetingId = req.params.id;

    // Extract all uploaded files
    const uploadedFiles = req.files?.pdf;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res
        .status(400)
        .json({ error: "No files uploaded or unsupported file type." });
    }

    // Create URLs for each uploaded file
    const documentUrls = uploadedFiles.map(
      (file) => "/uploads/meetingDocs/" + file.filename
    );

    // Push new files into existing array
    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { $push: { uploadedFile: { $each: documentUrls } } }, // Push multiple at once
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    res.json({ message: "Documents uploaded successfully", meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload documents" });
  }
};
const create = async (req, res) => {
  try {
    const { meetingTopic, meetingDate, meetingTime, meetingPlace } = req.body;

    if (!meetingTopic || !meetingDate || !meetingTime || !meetingPlace) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const meeting = new Meeting({
      meetingTopic,
      meetingDate,
      meetingTime,
      meetingPlace,
    });

    // Find all board members and executive roles with valid emails
    const recipients = await Member.find({
      role: {
        $in: ["board member", "president", "vice president", "secretary"],
      },
      email: { $exists: true, $ne: "" },
    }).select("email");

    const emailList = recipients.map((member) => member.email);

    if (emailList.length > 0) {
      const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">📢 New Meeting Scheduled</h2>
    <p style="font-size: 16px; color: #555;">Hello Board Members,</p>
    <p style="font-size: 16px; color: #555;">A new meeting has been arranged. Please find the details below:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <tr>
        <td style="padding: 8px; font-weight: bold; color: #222;">📝 Topic:</td>
        <td style="padding: 8px; color: #444;">${meetingTopic}</td>
      </tr>
      <tr style="background-color: #f1f1f1;">
        <td style="padding: 8px; font-weight: bold; color: #222;">📅 Date:</td>
        <td style="padding: 8px; color: #444;">${meetingDate}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold; color: #222;">⏰ Time:</td>
        <td style="padding: 8px; color: #444;">${meetingTime}</td>
      </tr>
      <tr style="background-color: #f1f1f1;">
        <td style="padding: 8px; font-weight: bold; color: #222;">📍 Place:</td>
        <td style="padding: 8px; color: #444;">${meetingPlace}</td>
      </tr>
    </table>
    <p style="margin-top: 20px; font-size: 14px; color: #888;">Please mark your calendar. We look forward to your presence.</p>
    <p style="font-size: 14px; color: #888;">Best regards,<br><strong>Management Team</strong></p>
  </div>
`;

      await sendMail(emailList, "New Meeting Scheduled", "", html);
    }
    await meeting.save();

    return res.status(201).json({ message: "Meeting created", meeting });
  } catch (error) {
    console.error("Error creating meeting:", error.message);
    res
      .status(500)
      .json({ error: "Failed to create meeting", details: error.message });
  }
};

const display = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ meetingDate: 1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meetingId = req.params.id;

    // Extract updated fields from body
    const { meetingDate, meetingTopic, meetingTime, meetingPlace } = req.body;

    // Check for uploaded files
    const uploadedFiles = req.files?.pdf || [];

    // Generate URLs for any newly uploaded PDFs
    const newDocumentUrls = uploadedFiles.map(
      (file) => "/uploads/meetingDocs/" + file.filename
    );

    // Build update object
    const updateData = {
      meetingDate,
      meetingTopic,
      meetingTime,
      meetingPlace,
    };

    // Add uploadedFile if new files were added
    if (newDocumentUrls.length > 0) {
      updateData.$push = {
        uploadedFile: { $each: newDocumentUrls },
      };
    }

    // Update document
    const meeting = await Meeting.findByIdAndUpdate(meetingId, updateData, {
      new: true,
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    res.json({ message: "Meeting updated successfully", meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update meeting" });
  }
};

const deleteMeetingPdf = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const { fileUrl } = req.body; // e.g. "/uploads/meetingDocs/filename.pdf"

    if (!fileUrl) {
      return res.status(400).json({ error: "No file URL provided" });
    }

    //  Remove file reference from DB
    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { $pull: { uploadedFile: fileUrl } },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Delete actual file from server
    const filePath = path.join(__dirname, "..", fileUrl); // relative path to file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.warn(
          "PDF removed from DB, but file not deleted from server:",
          err.message
        );
      }
    });

    res.json({ message: "PDF deleted successfully", meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete PDF" });
  }
};

module.exports = { create, upload, display, updateMeeting, deleteMeetingPdf };
