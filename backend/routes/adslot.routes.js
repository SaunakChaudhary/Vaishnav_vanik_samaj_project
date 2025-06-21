const express = require("express");
const router = express.Router();
const adSlotController = require("../controllers/adslot.controller");
const { upload4 } = require("../utils/multer");
const conditionalUpload = (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    // Apply multer middleware
    return upload4.fields([{ name: "image", maxCount: 1 }])(req, res, next);
  }
  next();
};
router.route("/book").post(adSlotController.book);
router.route("/available").get(adSlotController.available);
router.route("/admin/set-price").post(adSlotController.setSlots);
router.route("/admin/ad-price").get(adSlotController.adSlots);
router
.route("/add-advertise-image/:side")
.put(conditionalUpload, adSlotController.addImages);

router.route("/admin/get-ad-fees").get(adSlotController.getAdvertisementFees);


module.exports = router;
