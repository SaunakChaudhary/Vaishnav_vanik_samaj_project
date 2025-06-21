const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donation.controller");

router.route("/donate-amount").post(donationController.createDonation);
router.route("/get-donations").get(donationController.getDonations);

module.exports = router;
