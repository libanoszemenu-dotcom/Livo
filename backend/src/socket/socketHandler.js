const User = require("../models/User");
const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New user connected:", socket.id);

    // ✅ User connected
    socket.on("userConnected", async (userId) => {
      socket.userId = userId;
      socket.join(userId);

      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: Date.now(),
        });
        socket.broadcast.emit("userOnline", userId);
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    });

    // ✅ Send message
    socket.on("sendMessage", async (data) => {
      try {
        const { receiverId, text, image } = data;
        const message = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          text: text || "",
          image: image || "",
        });

        // Populate sender info
        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "username profilePic")
          .populate("receiver", "username profilePic");

        io.to(receiverId).emit("newMessage", populatedMessage);
        socket.emit("messageSent", populatedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("messageError", { message: "መልእክት መላክ አልተሳካም" });
      }
    });

    // ✅ Typing indicator
    socket.on("typing", (data) => {
      const { receiverId, isTyping } = data;
      socket.to(receiverId).emit("userTyping", {
        userId: socket.userId,
        isTyping,
      });
    });

    // ✅ Disconnect
    socket.on("disconnect", async () => {
      console.log("🔴 User disconnected:", socket.id);
      if (socket.userId) {
        try {
          await User.findByIdAndUpdate(socket.userId, {
            isOnline: false,
            lastSeen: Date.now(),
          });
          socket.broadcast.emit("userOffline", socket.userId);
        } catch (error) {
          console.error("Error updating user status:", error);
        }
      }
    });
  });
};
