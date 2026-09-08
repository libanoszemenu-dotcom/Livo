import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup({ username, email, password });
    if (success) navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-blue-700 p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-4xl font-bold text-white">Chatify</h2>
          <p className="text-white/70 mt-2">አዲስ መለያ ይፍጠሩ</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              ስም
            </label>
            <input
              type="text"
              placeholder="ስምዎ"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              ኢሜይል
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2">
              ምስጢር ቃል
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p className="text-white/50 text-xs mt-1">ቢያንስ 6 ቁምፊዎች</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-white p-3 rounded-xl mb-4 text-sm">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-green-600 py-3 rounded-xl font-bold hover:bg-green-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                በመመዝገብ ላይ...
              </span>
            ) : (
              "ይመዝገቡ"
            )}
          </button>
        </form>

        <p className="text-center text-white/70 text-sm mt-6">
          መለያ አለዎት?{" "}
          <Link to="/login" className="text-white font-bold hover:underline">
            ይግቡ
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
