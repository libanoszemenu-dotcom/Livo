import React, { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const FileUpload = ({ onFileUpload, disabled }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // የፋይል መጠን ማረጋገጥ (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("ፋይሉ ከ50MB ይበልጣል");
      return;
    }

    setUploading(true);
    setProgress(0);
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
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percent);
          },
        },
      );

      onFileUpload({
        url: response.data.url,
        fileName: file.name,
        fileSize: file.size,
        fileType: response.data.fileType,
      });
      toast.success("ፋይል በተሳካ ሁኔታ ተስቀሏል! 📎");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "ፋይል መስቀል አልተሳካም");
    } finally {
      setUploading(false);
      setProgress(0);
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      {uploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 min-w-[150px]"
        >
          <div className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            <span className="text-sm font-semibold">በመስቀል ላይ...</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}%</p>
        </motion.div>
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
      >
        {uploading ? "⏳" : "📎"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
        disabled={disabled || uploading}
      />
    </div>
  );
};

export default FileUpload;
