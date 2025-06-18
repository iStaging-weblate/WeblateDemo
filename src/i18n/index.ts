import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { create } from "zustand";

import zh from "./locales/zh.json";
import en from "./locales/en.json";
import ko from "./locales/ko.json";
import fr from "./locales/fr.json";

// 建立初始化狀態管理
interface I18nStore {
  isInitialized: boolean;
  setInitialized: (state: boolean) => void;
}

// 紀錄 i18n 是否初始化
export const useI18nStore = create<I18nStore>((set) => ({
  isInitialized: false,
  setInitialized: (state) => set({ isInitialized: state }),
}));

export const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
  ko: {
    translation: ko,
  },
  fr: {
    translation: fr,
  },
} as const;

export type Language = keyof typeof resources;

// 將所有 zh 開頭都轉成 zh
const languageConverter = (lng: string): string => {
  if (lng.toLowerCase().includes("zh")) return "zh";
  if (lng.toLowerCase().includes("en")) return "en";
  if (lng.toLowerCase().includes("ko")) return "ko";
  if (lng.toLowerCase().includes("fr")) return "fr";
  return lng;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      convertDetectedLanguage: languageConverter,
    },
    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    // 初始化完成後更新狀態
    useI18nStore.getState().setInitialized(true);
  });

export default i18n;
