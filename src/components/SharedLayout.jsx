import { Alert, Snackbar } from "@mui/material";
import cx from "clsx";
import { NavLink, Outlet } from "react-router-dom";

import { APP_NAV_ITEMS, APP_SHELL_COPY } from "../config/appShellConfig.js";
import { useAutosave } from "../context/AutosaveContext.jsx";
import styles from "./SharedLayout.module.scss";

export default function SharedLayout() {
  const {
    autosaveToast,
    closeAutosaveToast,
    handleAutosaveToastClose,
  } = useAutosave();

  return (
    <div className={styles.root}>
      <header className={cx(styles.appBar, "app-shell-nav")}>
        <div className={styles.container}>
          <div className={styles.toolbar}>
            <div className={styles.brandGroup}>
              <div className={styles.logoBox}>
                <span className={styles.logoText}>{APP_SHELL_COPY.logo}</span>
              </div>

              <div>
                <div className={styles.title}>{APP_SHELL_COPY.title}</div>
                <div className={styles.subtitle}>{APP_SHELL_COPY.subtitle}</div>
              </div>
            </div>

            <nav aria-label="Main navigation" className={styles.nav}>
              {APP_NAV_ITEMS.map(item => (
                <NavLink className={styles.navLink} end={item.end} key={item.to} to={item.to}>
                  {({ isActive }) => (
                    <span
                      className={cx(styles.navButton, {
                        [styles["navButton--active"]]: isActive,
                      })}
                    >
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <span className={styles.autosaveChip}>{APP_SHELL_COPY.autosaveChip}</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

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
          {APP_SHELL_COPY.autosaveToast}
        </Alert>
      </Snackbar>
    </div>
  );
}
