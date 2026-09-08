import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ቀለል ያለ ስሪት (ያለ LanguageDetector)
i18n.use(initReactI18next).init({
  resources: {
    am: {
      translation: {
        app: {
          name: "Chatify",
          login: "ግባ",
          logout: "ውጣ",
          signup: "ይመዝገቡ",
          email: "ኢሜይል",
          password: "ምስጢር ቃል",
          username: "ስም",
          users: "ተጠቃሚዎች",
          online: "በመስመር ላይ",
          offline: "ከመስመር ውጭ",
          messages: "መልእክቶች",
          no_messages: "ምንም መልእክቶች የሉም",
          type_message: "መልእክት ይጻፉ...",
          send: "ላክ",
          select_user: "ተጠቃሚ ይምረጡ",
          loading: "በመጫን ላይ...",
          no_users: "ምንም ተጠቃሚዎች የሉም",
        },
        auth: {
          signup_success: "እንኳን ደህና መጡ! 🎉",
          signup_error: "ምዝገባ አልተሳካም",
          login_success: "እንኳን ደህና መጡ! 👋",
          login_error: "መግቢያ አልተሳካም",
          logout_success: "ከመለያዎ ወጥተዋል!",
        },
      },
    },
  },
  lng: "am",
  fallbackLng: "am",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
