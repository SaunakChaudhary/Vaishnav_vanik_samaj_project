const express = require("express");
const Announcement = require("../controllers/announcements.controller")
const router = express.Router();

router.route("/create").post(Announcement.create);
router.route("/get").get(Announcement.getAnnouncements);
module.exports = router;

