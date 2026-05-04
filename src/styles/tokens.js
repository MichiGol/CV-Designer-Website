export const FONT_EDITOR = "'DM Sans',system-ui,sans-serif";

export const COLOR = {
  bgApp: "#010409",
  bgPanel: "#0d1117",
  bgSurface: "#161b22",
  bgCanvas: "#1c2128",
  border: "#21262d",
  borderMid: "#30363d",
  textPrimary: "#e6edf3",
  textSecondary: "#8b949e",
  textMuted: "#484f58",
  blue: "#58a6ff",
  blueDeep: "#2563eb",
  danger: "#f85149",
  dangerBg: "#1a0a0a",
  dangerBorder: "#f8514940",
};

export const inputBase = {
  background: COLOR.bgPanel,
  border: `1px solid ${COLOR.border}`,
  borderRadius: 8,
  boxSizing: "border-box",
  color: COLOR.textPrimary,
  fontFamily: FONT_EDITOR,
  fontSize: 12,
  outline: "none",
  padding: "7px 11px",
  width: "100%",
};

export const labelBase = {
  color: COLOR.textSecondary,
  display: "block",
  fontFamily: FONT_EDITOR,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  marginBottom: 4,
  textTransform: "uppercase",
};

export const editorCard = {
  background: COLOR.bgSurface,
  borderRadius: 10,
  border: `1px solid ${COLOR.border}`,
  padding: "14px",
  marginBottom: 12,
};

export const sectionLabel = {
  fontSize: 9,
  fontWeight: 700,
  color: COLOR.textMuted,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: 8,
  fontFamily: FONT_EDITOR,
};

export const muiFilledFieldSx = {
  "& .MuiInputLabel-root": {
    color: COLOR.textSecondary,
    fontFamily: FONT_EDITOR,
    "&.Mui-focused": { color: COLOR.blue },
  },
  "& .MuiFilledInput-root": {
    backgroundColor: COLOR.bgPanel,
    border: `1px solid ${COLOR.border}`,
    borderRadius: "8px",
    color: COLOR.textPrimary,
    overflow: "hidden",
    "&:before, &:after": { borderBottom: "none" },
    "&:hover:not(.Mui-disabled, .Mui-error):before": { borderBottom: "none" },
    "&.Mui-focused": {
      borderColor: COLOR.blue,
      boxShadow: `0 0 0 1px ${COLOR.blue}`,
    },
  },
  "& .MuiFilledInput-input": {
    color: COLOR.textPrimary,
    fontFamily: FONT_EDITOR,
    fontSize: 12,
    paddingTop: "18px",
    paddingBottom: "10px",
  },
  "& .MuiFilledInput-input.MuiSelect-select": {
    paddingTop: "18px",
    paddingBottom: "10px",
  },
  "& .MuiFilledInput-inputMultiline": {
    paddingTop: "18px",
    paddingBottom: "10px",
  },
};

export const muiFilledFieldProps = {
  InputLabelProps: { shrink: true },
  InputProps: { disableUnderline: true },
  size: "small",
  sx: muiFilledFieldSx,
  variant: "filled",
};

export const muiToggleButtonSx = {
  borderColor: COLOR.borderMid,
  color: COLOR.textSecondary,
  fontFamily: FONT_EDITOR,
  fontSize: 10,
  fontWeight: 700,
  minHeight: 34,
  textTransform: "none",
  "&.Mui-selected": {
    backgroundColor: "rgba(88, 166, 255, 0.12)",
    borderColor: COLOR.blue,
    color: COLOR.textPrimary,
  },
  "&.Mui-selected:hover": { backgroundColor: "rgba(88, 166, 255, 0.18)" },
};

export const propPanelInput = {
  width: "100%",
  boxSizing: "border-box",
  background: COLOR.bgSurface,
  border: `1px solid ${COLOR.border}`,
  borderRadius: 8,
  color: COLOR.textPrimary,
  padding: "7px 9px",
  fontSize: 11,
  outline: "none",
  fontFamily: FONT_EDITOR,
};
