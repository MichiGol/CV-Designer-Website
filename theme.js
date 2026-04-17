import { alpha, createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#7dd3fc",
    },
    background: {
      default: "#050910",
      paper: "rgba(8, 17, 31, 0.82)",
    },
    text: {
      primary: "#e6edf3",
      secondary: "#94a3b8",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "\"DM Sans\", \"Trebuchet MS\", sans-serif",
    h1: {
      fontFamily: "\"Cormorant Garamond\", Georgia, serif",
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: "\"Cormorant Garamond\", Georgia, serif",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(1, 4, 9, 0.76)",
          borderBottom: `1px solid ${alpha("#94a3b8", 0.16)}`,
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: [
            "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 28%)",
            "radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 24%)",
            "linear-gradient(180deg, #050910 0%, #0a111d 48%, #08111d 100%)",
          ].join(","),
          color: "#e6edf3",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${alpha("#94a3b8", 0.14)}`,
        },
      },
    },
  },
});
