const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meeting.controller");
const { upload5 } = require("../utils/multer");

const conditionalUpload = (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return upload5.fields([{ name: "pdf", maxCount: 10 }])(req, res, next);
  }
  next();
};

router.route("/create").post(meetingController.create);
router.route("/upload/:id").put(conditionalUpload, meetingController.upload);
router.route("/display").get(meetingController.display);
router.route("/update/:id").put(conditionalUpload, meetingController.updateMeeting);
router.route("/delete-pdf/:id").put(meetingController.deleteMeetingPdf);

module.exports = router;
