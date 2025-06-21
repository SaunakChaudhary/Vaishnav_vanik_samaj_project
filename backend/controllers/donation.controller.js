const Donation = require("../models/donation.model");

const createDonation = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      amount,
      message,
      transactionId,
    } = req.body;
    const donation = await Donation.create({
      fullName,
      email,
      phone,
      amount,
      message,
      transactionId,
    });

    return res.status(201).json({
      success: true,
      donation,
    });
  } catch (error) {
    return res.status(500).json({ message: " Internal Server Errror" + error });
  }
};

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    return res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" + error });
  }
};

module.exports = { createDonation , getDonations};
