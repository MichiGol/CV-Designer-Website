import { Alert, AppBar, Box, Button, Chip, Container, Snackbar, Toolbar, Typography } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import { APP_NAV_ITEMS, APP_SHELL_COPY } from "../config/appShellConfig.js";
import { useAutosave } from "../context/AutosaveContext.jsx";
import { getNavButtonSx, navLinkStyle, sharedLayoutSx } from "../styles/sharedLayoutStyles.js";

export default function SharedLayout() {
  const {
    autosaveToast,
    closeAutosaveToast,
    handleAutosaveToastClose,
  } = useAutosave();

  return (
    <Box sx={sharedLayoutSx.root}>
      <AppBar className="app-shell-nav" position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={sharedLayoutSx.toolbar}>
            <Box sx={sharedLayoutSx.brandGroup}>
              <Box sx={sharedLayoutSx.logoBox}>
                <Typography sx={sharedLayoutSx.logoText}>{APP_SHELL_COPY.logo}</Typography>
              </Box>

              <Box>
                <Typography sx={sharedLayoutSx.title}>{APP_SHELL_COPY.title}</Typography>
                <Typography color="text.secondary" sx={sharedLayoutSx.subtitle}>
                  {APP_SHELL_COPY.subtitle}
                </Typography>
              </Box>
            </Box>

            <Box sx={sharedLayoutSx.nav}>
              {APP_NAV_ITEMS.map(item => (
                <NavLink end={item.end} key={item.to} style={navLinkStyle} to={item.to}>
                  {({ isActive }) => (
                    <Button sx={getNavButtonSx(isActive)} variant="text">
                      {item.label}
                    </Button>
                  )}
                </NavLink>
              ))}
            </Box>

            <Chip
              color="primary"
              label={APP_SHELL_COPY.autosaveChip}
              size="small"
              sx={sharedLayoutSx.autosaveChip}
              variant="outlined"
            />
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={sharedLayoutSx.main}>
        <Outlet />
      </Box>

      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        autoHideDuration={2200}
        key={autosaveToast.key}
        onClose={handleAutosaveToastClose}
        open={autosaveToast.open}
      >
        <Alert
          onClose={closeAutosaveToast}
          severity="success"
          sx={sharedLayoutSx.autosaveAlert}
          variant="filled"
        >
          {APP_SHELL_COPY.autosaveToast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
