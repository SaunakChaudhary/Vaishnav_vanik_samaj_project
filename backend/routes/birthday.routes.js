const express = require("express");
const router = express.Router();

const birthdayController = require("../controllers/birthday.controller");

router.route("/today-birthday").get(birthdayController.TodayBirthday);
module.exports = router;
