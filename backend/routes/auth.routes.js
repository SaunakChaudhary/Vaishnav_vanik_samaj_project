const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { upload1 } = require("../utils/multer");

const conditionalUpload = (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    // Apply multer middleware
    return upload1.fields([{ name: "photo", maxCount: 1 }])(
      req,
      res,
      next
    );
  }
  next();
};

router.route("/signup").post(conditionalUpload,authController.signup);
router.route("/login").post(authController.Login);
router.route("/get-user").get(authMiddleware.userAuthMiddleware,authController.getUser);
router.route("/send-otp").post(authController.sendOTP);
router.route("/verify-otp").post(authController.verifyOTP);
router.route("/userDashobard/:UserId").get(authController.UserDashoboard);
router.route("/adminDashboard").get(authController.AdminDashboard);
router.route("/admin-login").post(authController.AdminLogin);
router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password").post(authController.resetPassword);

router.get('/admin/dashboard-data', authMiddleware.verifyAdmin, async(req, res) => {
  try {
      if (req.admin.role === "admin") {
        return res.status(200).json({ LoggedIn : true });
      }else{
        return res.status(400).json({ LoggedIn : false });
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
