import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "am", name: "አማርኛ", flag: "🇪🇹" },
    { code: "or", name: "Oromoo", flag: "🇪🇹" },
    { code: "ti", name: "ትግርኛ", flag: "🇪🇹" },
    { code: "aw", name: "አዊኛ", flag: "🇪🇹" },
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
            i18n.language === lang.code
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {lang.flag} {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
