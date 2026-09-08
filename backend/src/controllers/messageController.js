const Message = require("../models/Message");

// @desc    Get messages between users
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text, image } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text: text || "",
      image: image || "",
    });

    // Send via Socket.io
    const io = req.app.get("io");
    io.to(receiverId).emit("newMessage", message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { isRead: true, readAt: Date.now() },
      { new: true },
    );
    if (!message) {
      return res.status(404).json({ message: "መልእክት አልተገኘም" });
    }
    res.json(message);
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: error.message });
  }
};
