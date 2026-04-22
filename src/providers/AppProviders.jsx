import { CssBaseline, ThemeProvider } from "@mui/material";
import { AutosaveProvider } from "../context/AutosaveContext.jsx";
import { appTheme } from "../theme.js";

export function AppProviders({ children }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AutosaveProvider>{children}</AutosaveProvider>
    </ThemeProvider>
  );
}
