const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  downloadPDF,
  downloadExcel,
  uploadExcel,
} = require("../controllers/export.controller");

router.get("/download/pdf", downloadPDF);
router.get("/download/excel", downloadExcel);
router.post("/upload-excel",  upload.single("file"), uploadExcel);

module.exports = router;
