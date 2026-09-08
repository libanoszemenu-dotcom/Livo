const multer = require("multer");
const path = require("path");

// የፋይል አይነቶችን መፈቀድ
const allowedTypes = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/webp": "image",
  "audio/mpeg": "audio",
  "audio/mp3": "audio",
  "audio/wav": "audio",
  "video/mp4": "video",
  "video/webm": "video",
  "application/pdf": "document",
  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "document",
  "text/plain": "document",
};

// ፋይል ማጣራት
const fileFilter = (req, file, cb) => {
  const allowed = Object.keys(allowedTypes);
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("ይህ የፋይል አይነት አይፈቀድም"), false);
  }
};

// Multer ማዋቀር
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// የፋይል አይነት ማግኘት
const getFileType = (mimetype) => {
  return allowedTypes[mimetype] || "other";
};

// የፋይል አዶ ማግኘት
const getFileIcon = (fileType) => {
  const icons = {
    image: "🖼️",
    audio: "🎵",
    video: "🎬",
    document: "📄",
    other: "📎",
  };
  return icons[fileType] || "📎";
};

module.exports = { upload, getFileType, getFileIcon };
