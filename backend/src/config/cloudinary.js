const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// የተለያዩ ፋይሎችን ለመስቀል
const uploadFile = async (fileBuffer, folder, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder || "chatify",
          resource_type: resourceType,
          allowed_formats: [
            "jpg",
            "png",
            "gif",
            "mp3",
            "mp4",
            "pdf",
            "doc",
            "docx",
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(fileBuffer);
  });
};

const deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

module.exports = { cloudinary, uploadFile, deleteFile };
