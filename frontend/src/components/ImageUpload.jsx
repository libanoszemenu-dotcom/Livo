import React, { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ImageUpload = ({ onImageUpload, disabled }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // የምስል መጠን ማረጋገጥ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ምስሉ ከ5MB ይበልጣል");
      return;
    }

    // የምስል አይነት ማረጋገጥ
    if (!file.type.startsWith("image/")) {
      toast.error("እባክዎ ምስል ብቻ ይምረጡ");
      return;
    }

    // Preview ማሳየት
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/upload/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      onImageUpload(response.data.url);
      toast.success("ምስል በተሳካ ሁኔታ ተስቀሏል! 🖼️");
      setPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "ምስል መስቀል አልተሳካም");
      setPreview(null);
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      {preview && (
        <div className="absolute bottom-full mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div className="text-center text-xs text-gray-500 mt-1">
            {uploading ? "⏳ በመስቀል ላይ..." : "📸 ምስል ተመርጧል"}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || uploading}
        className={`px-4 py-3 rounded-xl transition ${
          disabled || uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
        }`}
        title={t("chat.image_upload")}
      >
        {uploading ? "⏳" : "🖼️"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleImageSelect}
        className="hidden"
        accept="image/*"
        disabled={disabled || uploading}
      />
    </div>
  );
};

export default ImageUpload;
