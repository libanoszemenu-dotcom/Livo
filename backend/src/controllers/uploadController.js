const { uploadFile, deleteFile } = require("../config/cloudinary");
const { getFileType } = require("../middleware/upload");

// ፋይል መስቀል
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "ምንም ፋይል አልተመረጠም" });
    }

    const fileType = getFileType(req.file.mimetype);
    const folder = `chatify/${fileType}s`;

    const result = await uploadFile(
      req.file.buffer,
      folder,
      fileType === "image" ? "image" : "auto",
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      fileType: fileType,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "ፋይል መስቀል አልተሳካም", error: error.message });
  }
};

// በርካታ ፋይሎችን መስቀል
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "ምንም ፋይሎች አልተመረጡም" });
    }

    const uploadPromises = req.files.map(async (file) => {
      const fileType = getFileType(file.mimetype);
      const folder = `chatify/${fileType}s`;
      const result = await uploadFile(
        file.buffer,
        folder,
        fileType === "image" ? "image" : "auto",
      );
      return {
        url: result.secure_url,
        publicId: result.public_id,
        fileType: fileType,
        fileName: file.originalname,
        fileSize: file.size,
        mimetype: file.mimetype,
      };
    });

    const results = await Promise.all(uploadPromises);
    res.json(results);
  } catch (error) {
    console.error("Multiple upload error:", error);
    res.status(500).json({ message: "ፋይሎች መስቀል አልተሳካም", error: error.message });
  }
};

// ፋይል መሰረዝ
exports.deleteFile = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ message: "Public ID ያስፈልጋል" });
    }
    const deleted = await deleteFile(publicId);
    if (deleted) {
      res.json({ message: "ፋይል በተሳካ ሁኔታ ተሰርዟል" });
    } else {
      res.status(500).json({ message: "ፋይል መሰረዝ አልተሳካም" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "ፋይል መሰረዝ አልተሳካም" });
  }
};
