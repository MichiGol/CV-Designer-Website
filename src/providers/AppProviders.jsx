import { CssBaseline, ThemeProvider } from "@mui/material";
import { AutosaveProvider } from "../context/AutosaveContext.jsx";
import { LanguageProvider } from "../context/LanguageContext.jsx";
import { appTheme } from "../theme.js";

export function AppProviders({ children }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <LanguageProvider>
        <AutosaveProvider>{children}</AutosaveProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
