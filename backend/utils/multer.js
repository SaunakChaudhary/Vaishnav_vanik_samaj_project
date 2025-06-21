const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary.config");
const path = require("path");

// Image Uploads
const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profilePics/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/eventPics/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/gallery/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const storage4 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/advertisement_images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const storage5 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/meetingDocs/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter5 = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const fileFilter2 = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/heic",
    "image/heif",
    "image/webp",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG, HEIC, HEIF and WEBP files are allowed"),
      false
    );
  }
};

// Upload handlers
const upload1 = multer({ storage: storage1, fileFilter2 });
const upload2 = multer({ storage: storage2, fileFilter2 });
const upload3 = multer({ storage: storage3, fileFilter2 });
const upload4 = multer({ storage: storage4, fileFilter2 });
const upload5 = multer({ storage: storage5, fileFilter5 });

module.exports = {
  upload1,
  upload2,
  upload3,
  upload4,
  upload5,
};
