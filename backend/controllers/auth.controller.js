const User = require("../models/members.model");
const EventRegistration = require("../models/event_registration.model");
const Donation = require("../models/donation.model");
const AdSlot = require("../models/adslot.model");
const AdvertisementFees = require("../models/advertisementFees.model");
const Events = require("../models/event.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../helper/sendMail");
const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");

// Generate a random 4-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Returns a 4-digit OTP
};
const otpStore = {};

// Signup
const signup = async (req, res) => {
  try {
    const {
      firstname,
      middlename,
      lastname,
      email,
      phone,
      wp_number,
      city,
      pincode,
      state,
      address,
      caste,
      profession,
      professionAddress,
      dob,
      country,
      password,
    } = req.body;

    // Check required fields
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if photo is uploaded
    if (!req.files || !req.files["photo"] || !req.files["photo"][0]) {
      return res.status(400).json({ message: "Profile photo is missing" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const generateId = customAlphabet("012356789", 8);
    const memberId = Number(generateId());
    // Create new user
    const newUser = await User.create({
      memberId,
      firstName: firstname,
      middleName: middlename,
      lastName: lastname,
      email,
      phone_number: phone,
      wp_number,
      city,
      pincode,
      state,
      address,
      caste,
      profession,
      professionAddress,
      photo: "/uploads/profilePics/" + req.files["photo"][0].filename,
      dob,
      country,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error: " + err.message });
  }
};

// sendOTP
const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please provide an email" });
  }

  try {
    const user = await User.find({ email });
    if (user.length > 0) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 500px;
      margin: 40px auto;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background-color: #004aad;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .content h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .otp-box {
      display: inline-block;
      background-color: #f0f4ff;
      padding: 15px 25px;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 5px;
      border-radius: 8px;
      margin: 20px 0;
      color: #004aad;
    }
    .footer {
      font-size: 13px;
      color: #888;
      text-align: center;
      padding: 15px 20px 25px;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    <div class="content">
      <h2>Hi, ${email}</h2>
      <p>Thank you for signing up! Use the OTP below to verify your email address:</p>
      <div class="otp-box">${otp}</div>
      <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
    </div>
    <div class="footer">
      If you did not request this, you can safely ignore this email.<br><br>
      &copy; 2025 Vaishnav Vanik Smaaaj
    </div>
  </div>

</body>
</html>`;

    // Store OTP
    otpStore[email] = { otp, otpExpiry };

    const otpSent = await sendMail(email, "Your OTP Code", "", html);
    if (!otpSent.success) {
      return res.status(500).json({ message: otpSent.error });
    }

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Please provide email and OTP" });
  }

  try {
    const storedData = otpStore[email];
    if (!storedData) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    const { otp: storedOtp, otpExpiry } = storedData;
    if (Date.now() > otpExpiry) {
      delete otpStore[email]; // Remove expired OTP
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (otp !== storedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStore[email]; // Remove OTP after successful verification
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "pending") {
      return res.status(404).json({
        message:
          "Your request is pending. We will notify you when your membership is accepted.",
        pending: true,
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Authentication Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const UserDashoboard = async (req, res) => {
  try {
    const { UserId } = req.params;
    if (!UserId) {
      return res.status(400).json({ message: "UserId parameter is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(UserId)) {
      return res.status(400).json({ message: "Invalid UserId format" });
    }

    const user = await User.findById(UserId);
    const currentDate = new Date();

    const upcomingEvents = await Events.find({
      eventDateTime: { $gt: currentDate },
    }).sort({ eventDateTime: 1 });

    const upcomingEventIds = upcomingEvents.map((event) => event._id);

    const registeredEvents = await EventRegistration.find({
      member: UserId,
      event: { $in: upcomingEventIds },
    });

    const registeredEventIds = new Set(
      registeredEvents.map((reg) => reg.event.toString())
    );
    const eventsWithRegistrationStatus = upcomingEvents.map((event) => {
      return {
        ...event.toObject(),
        registered: registeredEventIds.has(event._id.toString()),
      };
    });

    const totalMembers = await User.find({ status: "accepted" });
    const activeAds = await AdSlot.find({ isBooked: true });
    const UserAdvertisements = await AdSlot.find({ user: UserId }).populate(
      "adfees_id"
    );
    const totalAds = await AdSlot.countDocuments();
    const contributions = await Donation.find({ email: user.email });
    const result = await Donation.aggregate([
      { $match: { email: user.email } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalContribution = result[0]?.totalAmount || 0;
    const latestEvent = await Events.findOne({
      images1: { $exists: true, $ne: [] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      registeredEvents,
      eventsWithRegistrationStatus,
      totalMembers,
      activeAds,
      totalAds,
      contributions,
      totalContribution,
      UserAdvertisements,
      latestEvent,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const AdminDashboard = async (req, res) => {
  try {
    const user = await User.find();
    const totalEvents = await Events.find();
    const donations = await Donation.find();
    const totalDonation = donations.reduce(
      (total, donation) => total + donation.amount,
      0
    );
    const activeAds = await AdSlot.countDocuments({ isBooked: true });

    const paidMemberships = await User.find({ "membershipFees.isPaid": true });
    const totalMembershipAmount = paidMemberships.reduce(
      (total, user) => total + (user.membershipFees?.amount || 0),
      0
    );
    const advertisementFees = await AdvertisementFees.find();
    const totalAdvertisementAmount = advertisementFees.reduce(
      (total, fee) => total + (fee.price || 0),
      0
    );
    const data = await User.aggregate([
      {
        $match: {
          createdAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          newMembers: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const result = [];

    for (const item of data) {
      const activeCount = await User.countDocuments({
        createdAt: { $lte: new Date(item._id) },
        status: "accepted",
      });

      result.push({
        date: item._id,
        newMembers: item.newMembers,
        activeMembers: activeCount,
      });
    }
    const data1 = await Donation.aggregate([
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          amount: { $sum: "$amount" },
          donations: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: { $toString: "$_id" },
          amount: 1,
          donations: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({
      users: user.length,
      totalEvents: totalEvents.length,
      totalDonation,
      activeAds,
      totalMembershipAmount,
      totalAdvertisementAmount,
      memberData: result,
      donationData: data1,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Errror" + error });
  }
};

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check for admin credentials (you should store these securely in environment variables)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, adminPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please provide an email" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m", // Token valid for 10 minutes
    });

    const resetLink = `${
      process.env.FRONTEND_URL
    }/reset-password/${encodeURIComponent(resetToken)}`;

    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0d1117;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color:rgb(207, 200, 200);
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #161b22;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      overflow: hidden;
    }
    .header {
      background-color: #161b22;
      color: rgb(207, 200, 200);
      text-align: center;
      padding: 30px 20px;
      border-bottom: 1px solid #30363d;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
    }
    .content {
      padding: 30px 25px;
      text-align: center;
      color: rgb(207, 200, 200);
    }
    .content p {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .reset-button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #238636;
      color:white;
      font-weight: bold;
      font-size: 16px;
      text-decoration: none;
      border-radius: 8px;
      margin-top: 10px;
      transition: background-color 0.3s;
    }
    .reset-button:hover {
      background-color: #2ea043;
    }
    .footer {
      padding: 20px;
      background: #0d1117;
      font-size: 12px;
      text-align: center;
      color:rgb(191, 201, 213);
      border-top: 1px solid #30363d;
    }
    .footer a {
      color: #58a6ff;
      text-decoration: none;
      margin: 0 8px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>You requested to reset your password. Click the button below to proceed.</p>
      <a href='${resetLink}' class="reset-button">Reset Password</a>
      <p style="margin-top: 20px;">This link will expire in <strong>10 minutes</strong>. If you didn&apos;t request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; 2025 <strong>Vaishnav vanik samaj</strong>. All rights reserved. <br/>
    </div>
  </div>
</body>
</html>
    `;

    // Send email with reset link
    const emailSent = await sendMail(email, "Password Reset", "", html);
    if (!emailSent.success) {
      return res.status(500).json({ message: emailSent.error });
    }

    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Please provide token and new password" });
  }
  const finalToken = decodeURIComponent(token).split(" ")[0].split("=")[0];
  try {
    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET);
    if (decoded.exp < Date.now() / 1000) {
      return res.status(400).json({ message: "Token has expired" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  sendOTP,
  verifyOTP,
  Login,
  getUser,
  UserDashoboard,
  AdminDashboard,
  AdminLogin,
  forgotPassword,
  resetPassword,
};
