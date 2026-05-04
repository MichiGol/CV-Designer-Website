import { useEffect, useRef, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import cx from "clsx";
import { Check, ChevronDown, Menu, X } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import deFlagIcon from "../assets/flags/de.svg";
import gbFlagIcon from "../assets/flags/gb.svg";
import { APP_LANGUAGE_OPTIONS, APP_NAV_ITEMS, APP_SHELL_COPY } from "../config/appShellConfig.js";
import { useAutosave } from "../context/AutosaveContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useTemplateEditorStore } from "../store/templateEditorStore.js";
import { PROJECT_RESET_EVENT, resetProjectData } from "../utils/projectReset.js";
import styles from "./SharedLayout.module.scss";

const LANGUAGE_FLAG_ICONS = {
  DE: deFlagIcon,
  EN: gbFlagIcon,
};

const MOBILE_NAV_ID = "app-shell-navigation";
const RESET_CONFIRM_SECONDS = 3;

export default function SharedLayout() {
  const languageToggleRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(RESET_CONFIRM_SECONDS);
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const {
    autosaveToast,
    closeAutosaveToast,
    handleAutosaveToastClose,
    notifyAutosave,
  } = useAutosave();
  const { currentLanguage, languageCode, setLanguageCode } = useLanguage();
  const copy = APP_SHELL_COPY[languageCode];
  const availableLanguages = APP_LANGUAGE_OPTIONS.filter(language => language.code !== currentLanguage.code);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!resetDialogOpen || resetCountdown <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setResetCountdown(current => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resetCountdown, resetDialogOpen]);

  const handleLanguageSelect = language => {
    setLanguageCode(language.code);
    setMobileMenuOpen(false);

    if (languageToggleRef.current) {
      languageToggleRef.current.open = false;
    }
  };

  const handleOpenResetDialog = () => {
    setMobileMenuOpen(false);
    if (languageToggleRef.current) {
      languageToggleRef.current.open = false;
    }
    setResetCountdown(RESET_CONFIRM_SECONDS);
    setResetError("");
    setResetDialogOpen(true);
  };

  const handleCloseResetDialog = () => {
    if (isResetting) {
      return;
    }

    setResetDialogOpen(false);
    setResetError("");
  };

  const handleConfirmProjectReset = async () => {
    if (resetCountdown > 0 || isResetting) {
      return;
    }

    setIsResetting(true);
    setResetError("");

    try {
      const resetState = await resetProjectData();

      useTemplateEditorStore.getState().resetToDefaults(resetState.savedAt);
      window.dispatchEvent(new CustomEvent(PROJECT_RESET_EVENT, { detail: resetState }));
      if (location.search) {
        navigate(location.pathname, { replace: true });
      }
      notifyAutosave();
      setResetDialogOpen(false);
    } catch (error) {
      console.warn("Unable to reset the project.", error);
      setResetError(copy.resetProjectError);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className={styles.root}>
      <header className={cx(styles.appBar, "app-shell-nav")}>
        <div className={styles.container}>
          <div className={styles.toolbar}>
            <div className={styles.brandGroup}>
              <div className={styles.logoBox}>
                <span className={styles.logoText}>{copy.logo}</span>
              </div>

              <div className={styles.brandCopy}>
                <div className={styles.title}>{copy.title}</div>
                <div className={styles.subtitle}>{copy.subtitle}</div>
              </div>
            </div>

            <nav
              aria-label={copy.navigationLabel}
              className={cx(styles.nav, {
                [styles["nav--open"]]: mobileMenuOpen,
              })}
              id={MOBILE_NAV_ID}
            >
              {APP_NAV_ITEMS.map(item => (
                <NavLink className={styles.navLink} end={item.end} key={item.to} to={item.to}>
                  {({ isActive }) => (
                    <span
                      className={cx(styles.navButton, {
                        [styles["navButton--active"]]: isActive,
                      })}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label[languageCode]}
                    </span>
                  )}
                </NavLink>
              ))}

              <button
                className={cx(styles.navButton, styles.resetProjectTrigger)}
                onClick={handleOpenResetDialog}
                type="button"
              >
                {copy.resetProjectLabel}
              </button>
            </nav>

            <div className={styles.headerActions}>
              <span className={styles.autosaveChip}>
                <Check aria-hidden="true" className={styles.autosaveIcon} size={15} strokeWidth={2.8} />
                {copy.autosaveChip}
              </span>

              <details className={styles.languageToggle} ref={languageToggleRef}>
                <summary
                  aria-label={`${copy.languageToggleLabel}: ${currentLanguage.label[languageCode]}`}
                  className={styles.languageSummary}
                >
                  <img
                    alt=""
                    aria-hidden="true"
                    className={styles.languageFlag}
                    src={LANGUAGE_FLAG_ICONS[currentLanguage.code]}
                  />
                  <span className={styles.languageCode}>{currentLanguage.code}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={styles.languageChevron}
                    size={14}
                    strokeWidth={2.5}
                  />
                </summary>

                <div aria-label={copy.languageMenuLabel} className={styles.languageMenu} role="menu">
                  {availableLanguages.map(language => (
                    <button
                      className={styles.languageOption}
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      role="menuitem"
                      type="button"
                    >
                      <img
                        alt=""
                        aria-hidden="true"
                        className={styles.languageFlag}
                        src={LANGUAGE_FLAG_ICONS[language.code]}
                      />
                      <span>{language.code}</span>
                      <span className={styles.languageName}>{language.label[languageCode]}</span>
                    </button>
                  ))}
                </div>
              </details>

              <button
                aria-controls={MOBILE_NAV_ID}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? copy.mobileMenuCloseLabel : copy.mobileMenuLabel}
                className={styles.mobileMenuButton}
                onClick={() => setMobileMenuOpen(open => !open)}
                type="button"
              >
                {mobileMenuOpen ? (
                  <X aria-hidden="true" size={20} strokeWidth={2.5} />
                ) : (
                  <Menu aria-hidden="true" size={20} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      {resetDialogOpen ? (
        <div className={styles.resetOverlay}>
          <section
            aria-describedby="project-reset-description"
            aria-labelledby="project-reset-title"
            aria-modal="true"
            className={styles.resetDialog}
            role="alertdialog"
          >
            <div className={styles.resetDialogHeader}>
              <h2 className={styles.resetDialogTitle} id="project-reset-title">
                {copy.resetProjectTitle}
              </h2>
              <p className={styles.resetDialogDescription} id="project-reset-description">
                {copy.resetProjectDescription}
              </p>
            </div>

            {resetError ? <div className={styles.resetError}>{resetError}</div> : null}

            <div className={styles.resetDialogActions}>
              <button
                className={styles.resetButton}
                disabled={isResetting}
                onClick={handleCloseResetDialog}
                type="button"
              >
                {copy.resetProjectCancel}
              </button>
              <button
                className={cx(styles.resetButton, styles["resetButton--danger"])}
                disabled={resetCountdown > 0 || isResetting}
                onClick={handleConfirmProjectReset}
                type="button"
              >
                {isResetting
                  ? copy.resetProjectWorking
                  : resetCountdown > 0
                    ? copy.resetProjectWait(resetCountdown)
                    : copy.resetProjectConfirm}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        autoHideDuration={2200}
        key={autosaveToast.key}
        onClose={handleAutosaveToastClose}
        open={autosaveToast.open}
      >
        <Alert
          className={styles.autosaveAlert}
          onClose={closeAutosaveToast}
          severity="success"
          variant="filled"
        >
          {copy.autosaveToast}
        </Alert>
      </Snackbar>
    </div>
  );
}
