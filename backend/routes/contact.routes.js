const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");

router.route("/send-message").post(contactController.contactusForm);
router.route("/display-messages").get(contactController.displayInquiries);
router.route("/reply-inquiry").post(contactController.replyToInquiry);

module.exports = router;