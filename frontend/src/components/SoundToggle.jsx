import React, { useState, useEffect } from "react";
import { soundManager } from "../utils/sound";

const SoundToggle = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("soundEnabled");
    if (saved !== null) {
      const enabled = saved === "true";
      setIsEnabled(enabled);
      if (!enabled) {
        soundManager.enabled = false;
      }
    }
  }, []);

  const toggleSound = () => {
    const enabled = soundManager.toggle();
    setIsEnabled(enabled);
    localStorage.setItem("soundEnabled", enabled.toString());
  };

  return (
    <button
      onClick={toggleSound}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      title={isEnabled ? "🔊 ድምጽ አብራ" : "🔇 ድምጽ አጥፋ"}
    >
      {isEnabled ? "🔊" : "🔇"}
    </button>
  );
};

export default SoundToggle;
