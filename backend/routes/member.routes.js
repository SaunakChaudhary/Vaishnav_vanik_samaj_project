const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");
const { upload1 } = require("../utils/multer");

// Middleware to conditionally use multer
const conditionalUpload = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  if (contentType.includes("multipart/form-data")) {
    upload1.any()(req, res, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "File upload error", error: err.message });
      }
      next();
    });
  } else {
    next(); // Skip multer if not multipart
  }
};

router.route("/display").get(memberController.displayMembers);
router.route("/status-update/:id").put(memberController.StatusUpdateOfMember);
router
  .route("/update-profile/:userId")
  .put(conditionalUpload, memberController.updateProfile);
router.route("/assign-designation").post(memberController.assignDesignation);
router
  .route("/:id/membership-fees")
  .patch(memberController.updateMembershipFees);
module.exports = router;
