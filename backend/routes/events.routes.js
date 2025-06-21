const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const { upload2, upload3 } = require("../utils/multer");

const conditionalUpload = (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    // Apply multer middleware
    return upload2.fields([{ name: "eventPhoto", maxCount: 1 }])(
      req,
      res,
      next
    );
  }
  next();
};

router.route("/add").post(conditionalUpload, eventController.addEvent);
router.route("/display").get(eventController.displayEvent);
router.route("/delete/:eventId").delete(eventController.deleteEvent);
router
  .route("/update/:eventId")
  .put(conditionalUpload, eventController.updateEvent);
router
  .route("/upload-images")
  .post(upload3.array("images"), eventController.uploadImages);

router.route("/delete-images").put(eventController.deleteImages);
router.route("/event-registration").post(eventController.eventRegistration);
router.route("/event-registration-members").get(eventController.eventRegistrationMembers);

module.exports = router;
