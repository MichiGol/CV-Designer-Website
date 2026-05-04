import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { APP_LANGUAGE_OPTIONS, DEFAULT_APP_LANGUAGE } from "../config/appShellConfig.js";
import { STORAGE_KEYS } from "../config/storageKeys.js";

const LanguageContext = createContext(null);
const LANGUAGE_CODES = new Set(APP_LANGUAGE_OPTIONS.map(language => language.code));

function getSupportedLanguage(code) {
  return LANGUAGE_CODES.has(code) ? code : DEFAULT_APP_LANGUAGE;
}

function getInitialLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_APP_LANGUAGE;
  }

  return getSupportedLanguage(window.localStorage.getItem(STORAGE_KEYS.appLanguage));
}

export function LanguageProvider({ children }) {
  const [languageCode, setLanguageCodeState] = useState(getInitialLanguage);

  const currentLanguage = useMemo(
    () => APP_LANGUAGE_OPTIONS.find(language => language.code === languageCode) ?? APP_LANGUAGE_OPTIONS[0],
    [languageCode],
  );

  const setLanguageCode = useCallback(nextLanguageCode => {
    setLanguageCodeState(getSupportedLanguage(nextLanguageCode));
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLanguage.locale;
    window.localStorage.setItem(STORAGE_KEYS.appLanguage, languageCode);
  }, [currentLanguage.locale, languageCode]);

  const value = useMemo(
    () => ({
      currentLanguage,
      languageCode,
      setLanguageCode,
    }),
    [currentLanguage, languageCode, setLanguageCode],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider.");
  }

  return context;
}
