const User = require("../models/members.model");
const sendMail = require("../helper/sendMail");
const fs = require("fs");
const path = require("path");

const deleteFileIfExists = (relativePath) => {
  const fullPath = path.join(__dirname, "..", relativePath);  
  if (relativePath != "/uploads/Default/User.png" && fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};
const StatusUpdateOfMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedMember = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Membership Approval</title>
  <style>
    body {
      margin: 0;
      background-color: #f2f4f8;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    .email-header {
      background: linear-gradient(to right, #1d3557, #457b9d);
      padding: 30px;
      color: #ffffff;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 26px;
    }
    .email-content {
      padding: 30px;
      color: #333333;
      text-align: left;
    }
    .email-content h2 {
      font-size: 22px;
      margin-bottom: 10px;
      color: #1d3557;
    }
    .email-content p {
      font-size: 16px;
      line-height: 1.6;
      margin: 15px 0;
    }
    .cta-button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #457b9d;
      color: #ffffff;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #365f80;
    }
    .email-footer {
      font-size: 12px;
      text-align: center;
      color: #999999;
      padding: 20px;
      background-color: #f8f9fa;
      border-top: 1px solid #eaeaea;
    }
  </style>
</head>
<body>

  <div class="email-container">
    <div class="email-header">
      <h1>Membership Approved 🎉</h1>
    </div>
    <div class="email-content">
      <h2>Hello ${updatedMember.firstName + " " + updatedMember.lastName},</h2>
      <p>
        We are pleased to inform you that your request to join <strong>Vaishnav Vanik Samaj</strong> has been <span style="color: #1d3557; font-weight: bold;">successfully approved</span>.
      </p>
      <p>
        As a valued member, you now have full access to our events, announcements, and community discussions.
      </p>
      <p>
        To begin, click the button below to visit your member dashboard:
      </p>
      <a href='${
        process.env.DASHBOARD_LINK
      }' class="cta-button">Access Dashboard</a>
      <p style="margin-top: 30px;">
        If you have any questions or need help getting started, don’t hesitate to contact us.
      </p>
      <p><strong>Vaishnav Vanik Samaaj Admin Team</strong></p>
    </div>
    <div class="email-footer">
      &copy; 2025 Our Samaj. All rights reserved.<br />
      This is an automated message. Please do not reply directly.
    </div>
  </div>
</body>
</html>
    `;

    if (status == "accepted") {
      const mailSent = await sendMail(
        updatedMember.email,
        `Membership Approval`,
        "",
        html
      );
      if (!mailSent.success) {
        return res.status(500).json({ message: mailSent.error });
      }
      return res
        .status(200)
        .json({ member: updatedMember, message: "Profile Accpeted" });
    }

    return res.status(200).json({ member: updatedMember });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const displayMembers = async (req, res) => {
  try {
    const membersDetails = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ membersDetails });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || [];

    // Fetch old user first
    const oldUser = await User.findById(req.params.userId);
    if (!oldUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Handle user photo update and deletion
    const userPhotoFile = files.find((f) => f.fieldname === "photo");
    let userPhoto = body.photo || oldUser.photo || "";

    if (userPhotoFile) {
      // Delete old photo if it exists
      if (oldUser.photo && oldUser.photo !== "") {
        deleteFileIfExists(oldUser.photo);
      }

      userPhoto = "/uploads/profilePics/" + userPhotoFile.filename;
    }

    // 2. Handle family member updates
    // 2. Process incoming familyMembers from body
    const oldMembers = oldUser.familyMembers || [];
    const newMembers = Array.isArray(body.familyMembers)
      ? body.familyMembers
      : [];

    // Parse new members with file handling
    const familyMembers = newMembers.map((member, index) => {
      const photoField = `familyMembers[${index}][photo]`;
      const photoFile = files.find((f) => f.fieldname === photoField);

      const existingOld = oldMembers.find((old) => old.phone === member.phone); // or match by fullName

      // If new photo uploaded, delete old photo
      if (photoFile && existingOld?.photo) {
        deleteFileIfExists(existingOld.photo);
      }

      return {
        fullName: member.fullName || "",
        dob: member.dob || "",
        relation: member.relation || "",
        profession: member.profession || "",
        academicBackground: member.academicBackground || "",
        achivements: member.achivements || "",
        phone: member.phone || "",
        photo: photoFile
          ? "/uploads/profilePics/" + photoFile.filename
          : member.photo || existingOld?.photo || "",
      };
    });

    // 🧹 Step to delete removed family members' images
    const newPhones = familyMembers.map((m) => m.phone);
    oldMembers.forEach((old) => {
      if (!newPhones.includes(old.phone) && old.photo) {
        deleteFileIfExists(old.photo);
      }
    });

    // 3. Build updated user object
    const user = {
      firstName: body.firstName || "",
      middleName: body.middleName || "",
      lastName: body.lastName || "",
      email: body.email || "",
      phone_number: body.phone_number || "",
      wp_number: body.wp_number || "",
      address: body.address || "",
      city: body.city || "",
      state: body.state || "",
      caste: body.caste || "",
      country: body.country || "",
      pincode: body.pincode || "",
      dob: body.dob || "",
      profession: body.profession || "",
      professionAddress: body.professionAddress || "",
      achivements: body.achivements || "",
      education: body.education || "",
      photo: userPhoto,
      familyMembers,
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, user, {
      new: true,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json({
      message: "Internal Server Error: " + err.message,
    });
  }
};

const assignDesignation = async (req, res) => {
  try {
    const { roles } = req.body;

    if (!Array.isArray(roles) || !roles.length) {
      return res.status(400).json({ message: "Invalid roles data" });
    }

    const updates = roles.map(async ({ id, role }) => {
      const updatedMember = await User.findByIdAndUpdate(
        id,
        { role: role },
        { new: true }
      );
      return updatedMember;
    });

    const results = await Promise.all(updates);
    const failedUpdates = results.filter((r) => !r);

    if (failedUpdates.length) {
      return res.status(400).json({
        message: "Some member updates failed",
        failedCount: failedUpdates.length,
      });
    }

    res.status(200).json({
      message: "Designations assigned successfully",
      updatedMembers: results,
    });
  } catch (error) {
    console.error("Error assigning roles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMembershipFees = async (req, res) => {
  const { id } = req.params;
  const { isPaid, amount, transactionId } = req.body;

  try {
    const member = await User.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.membershipFees = {
      isPaid: isPaid ?? member.membershipFees.isPaid,
      amount: amount ?? member.membershipFees.amount,
      transactionId: transactionId ?? member.membershipFees.transactionId,
    };

    await member.save();

    res.status(200).json({
      message: "Membership fee updated successfully",
      membershipFees: member.membershipFees,
    });
  } catch (err) {
    console.error("Error updating membership fees:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  StatusUpdateOfMember,
  displayMembers,
  updateProfile,
  assignDesignation,
  updateMembershipFees,
};
