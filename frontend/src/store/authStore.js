import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ ፖርቱን ወደ 3001 ቀይሩ
const API_URL = "http://localhost:3001/api";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      console.log("📝 Signup request:", userData);
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      console.log("✅ Signup response:", response.data);

      localStorage.setItem("token", response.data.token);
      set({ user: response.data, isLoading: false });
      toast.success("እንኳን ደህና መጡ! 🎉");
      return true;
    } catch (error) {
      console.error("❌ Signup error:", error);
      const message = error.response?.data?.message || "ምዝገባ አልተሳካም";
      set({ error: message, isLoading: false });
      toast.error(message);
      return false;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      console.log("📝 Login request:", credentials.email);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log("✅ Login response:", response.data);

      localStorage.setItem("token", response.data.token);
      set({ user: response.data, isLoading: false });
      toast.success("እንኳን ደህና መጡ! 👋");
      return true;
    } catch (error) {
      console.error("❌ Login error:", error);
      const message = error.response?.data?.message || "መግቢያ አልተሳካም";
      set({ error: message, isLoading: false });
      toast.error(message);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
    toast.success("ከመለያዎ ወጥተዋል!");
  },
}));

export default useAuthStore;
