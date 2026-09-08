const express = require("express");
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");
const router = express.Router();

// ============================================
// 📝 SIGNUP - ምዝገባ
// ============================================
router.post("/signup", async (req, res) => {
  try {
    console.log("📝 Signup request received:", req.body);
    const { username, email, password } = req.body;

    // ✅ ተጠቃሚ አለ እንደሆነ ያረጋግጡ
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({
        message: "ተጠቃሚ ቀድሞ አለ",
      });
    }

    // ✅ አዲስ ተጠቃሚ ይፍጠሩ
    const user = await User.create({
      username,
      email,
      password,
    });

    console.log("✅ User created:", user._id);

    // ✅ Token ይፍጠሩ
    const token = generateToken(user._id);

    // ✅ ምላሽ ይላኩ
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({
      message: error.message || "ምዝገባ አልተሳካም",
    });
  }
});

// ============================================
// 🔐 LOGIN - መግቢያ
// ============================================
router.post("/login", async (req, res) => {
  try {
    console.log("📝 Login request received:", req.body.email);
    const { email, password } = req.body;

    // ✅ ተጠቃሚ ያግኙ
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        message: "የተሳሳተ ኢሜይል ወይም ምስጢር ቃል",
      });
    }

    // ✅ ምስጢር ቃል ያረጋግጡ
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({
        message: "የተሳሳተ ኢሜይል ወይም ምስጢር ቃል",
      });
    }

    // ✅ Token ይፍጠሩ
    const token = generateToken(user._id);
    console.log("✅ Login successful:", email);

    // ✅ ምላሽ ይላኩ
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      message: error.message || "መግቢያ አልተሳካም",
    });
  }
});

// ============================================
// 👤 GET CURRENT USER - የአሁኑን ተጠቃሚ ማግኘት
// ============================================
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "እባክዎ ይግቡ",
      });
    }

    const decoded = require("jsonwebtoken").verify(
      token,
      process.env.JWT_SECRET,
    );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "ተጠቃሚ አልተገኘም",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Get user error:", error);
    res.status(401).json({
      message: "ያልተፈቀደ ጥያቄ",
    });
  }
});

module.exports = router;
