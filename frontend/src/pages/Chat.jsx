import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";
import FileUpload from "../components/FileUpload";
import ImageUpload from "../components/ImageUpload";
import SoundToggle from "../components/SoundToggle";
import { playNotification, playMessage, playTyping } from "../utils/sound";

const Chat = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // ከላይ ያሉትን እነዚህን መስመሮች ይፈልጉ እና ይቀይሩ

  const API_URL = "http://localhost:3001/api"; // 3000 → 3001
  const SOCKET_URL = "http://localhost:3001"; // 3000 → 3001

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Socket connection
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    const socketInstance = io(SOCKET_URL, {
      auth: { token },
    });
    setSocket(socketInstance);

    socketInstance.emit("userConnected", user._id);

    socketInstance.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);

      if (message.sender !== user._id) {
        playNotification();
        if (Notification.permission === "granted") {
          new Notification("💬 Chatify", {
            body: `አዲስ መልእክት ከ ${message.sender?.username || "ተጠቃሚ"}`,
            icon: "/vite.svg",
          });
        }
      } else {
        playMessage();
      }
    });

    socketInstance.on("userOnline", (userId) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isOnline: true } : u)),
      );
    });

    socketInstance.on("userOffline", (userId) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isOnline: false } : u)),
      );
    });

    socketInstance.on("userTyping", (data) => {
      const { userId, isTyping } = data;
      if (isTyping && userId !== user._id) {
        playTyping();
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      socketInstance.disconnect();
    };
  }, [user, navigate]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/messages/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    socket.emit("sendMessage", {
      receiverId: selectedUser._id,
      text: newMessage,
      image: "",
    });
    setNewMessage("");
  };

  const handleImageUpload = (imageUrl) => {
    if (!socket || !selectedUser) return;
    socket.emit("sendMessage", {
      receiverId: selectedUser._id,
      text: "",
      image: imageUrl,
    });
  };

  const handleFileUpload = (fileData) => {
    if (!socket || !selectedUser) return;
    socket.emit("sendMessage", {
      receiverId: selectedUser._id,
      text: "",
      image: "",
      file: fileData.url,
      fileName: fileData.fileName,
      fileSize: fileData.fileSize,
      fileType: fileData.fileType,
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg/90 transition-colors duration-300">
      {/* ✅ ዘመናዊ Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <span className="text-3xl">💬</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {t("app.name")}
            </h1>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              v2.0
            </span>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm">{user?.username}</span>
            </motion.div>
            <LanguageSwitcher />
            <SoundToggle />
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="bg-red-500/30 hover:bg-red-500/50 px-4 py-2 rounded-xl transition backdrop-blur-sm"
            >
              🚪 {t("app.logout")}
            </motion.button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden container mx-auto p-4 gap-4">
        {/* ✅ ዘመናዊ Sidebar - ተጠቃሚዎች */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-80 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-dark-border/20 p-4 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              👥 {t("app.users")}
              <span className="text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {users.length}
              </span>
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 ፈልግ..."
                className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <span className="text-4xl block mb-2">😔</span>
              <p>{t("app.no_users")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {users.map((u, index) => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                      selectedUser?._id === u._id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => setSelectedUser(u)}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          u.isOnline
                            ? "bg-green-500 shadow-lg shadow-green-500/50"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{u.username}</p>
                      <p className="text-xs opacity-70 flex items-center gap-1">
                        {u.isOnline ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            🟢 {t("app.online")}
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            ⚪ {t("app.offline")}
                          </>
                        )}
                      </p>
                    </div>
                    {u.isOnline && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* ✅ ዘመናዊ Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-dark-border/20 overflow-hidden"
        >
          {/* Chat Header */}
          {selectedUser ? (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center gap-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                  {selectedUser.username?.charAt(0).toUpperCase()}
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    selectedUser.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {selectedUser.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {selectedUser.isOnline ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      🟢 {t("app.online")}
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                      ⚪ {t("app.offline")}
                    </>
                  )}
                  {isTyping && (
                    <span className="text-blue-500 animate-pulse ml-2">
                      ✍️ በመተየብ ላይ...
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 text-center text-gray-400">
              👆 {t("app.select_user")}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-900/10 dark:to-transparent">
            {messages.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center text-gray-500 dark:text-gray-400 mt-20"
              >
                <span className="text-6xl block mb-4">💬</span>
                <p className="text-lg font-semibold">ምንም መልእክቶች የሉም</p>
                <p className="text-sm opacity-60">መልእክት ለመጀመር ይጻፉ</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: idx * 0.01 }}
                    className={`flex ${msg.sender === user?._id ? "justify-end" : "justify-start"}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[70%] p-3 rounded-2xl shadow-lg ${
                        msg.sender === user?._id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none shadow-blue-500/20"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-gray-300/20 dark:shadow-gray-700/20"
                      }`}
                    >
                      {msg.image && (
                        <motion.img
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          src={msg.image}
                          alt="message"
                          className="max-w-xs rounded-lg mb-2 cursor-pointer hover:opacity-90 transition"
                          onClick={() => window.open(msg.image, "_blank")}
                        />
                      )}
                      {msg.file && (
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="flex items-center gap-2 p-2 bg-white/20 rounded-lg mb-2 cursor-pointer hover:bg-white/30 transition"
                          onClick={() => window.open(msg.file, "_blank")}
                        >
                          <span className="text-2xl">📎</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold truncate max-w-[150px]">
                              {msg.fileName}
                            </p>
                            <p className="text-xs opacity-70">
                              {formatFileSize(msg.fileSize)}
                            </p>
                          </div>
                          <span className="text-lg">⬇️</span>
                        </motion.div>
                      )}
                      <p className="break-words">{msg.text}</p>
                      <p className="text-[10px] opacity-60 mt-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm"
          >
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder={
                  selectedUser ? t("app.type_message") : t("app.select_user")
                }
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!selectedUser}
              />
              <ImageUpload
                onImageUpload={handleImageUpload}
                disabled={!selectedUser}
              />
              <FileUpload
                onFileUpload={handleFileUpload}
                disabled={!selectedUser}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedUser}
              >
                📤 {t("app.send")}
              </motion.button>
            </form>
            {!selectedUser && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                👆 {t("app.select_user")}
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;
