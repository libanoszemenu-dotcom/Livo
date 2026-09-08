const express = require("express");
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const {
  uploadFile,
  uploadMultiple,
  deleteFile,
} = require("../controllers/uploadController");
const router = express.Router();

// አንድ ፋይል መስቀል
router.post("/upload", protect, upload.single("file"), uploadFile);

// በርካታ ፋይሎችን መስቀል
router.post(
  "/upload-multiple",
  protect,
  upload.array("files", 5),
  uploadMultiple,
);

// ፋይል መሰረዝ
router.delete("/delete", protect, deleteFile);

module.exports = router;
