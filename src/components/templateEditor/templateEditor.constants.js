import { A4_HEIGHT_PX, A4_WIDTH_PX } from "../../config/pageSizes.js";

export const A4_W = A4_WIDTH_PX;
export const A4_H = A4_HEIGHT_PX;

export const EDITOR_TABS = [
  { id: "personal", label: "Persoenlich" },
  { id: "education", label: "Ausbildung" },
  { id: "experience", label: "Erfahrung" },
  { id: "skills", label: "Kenntnisse" },
  { id: "languages", label: "Sprachen" },
  { id: "hobbies", label: "Hobbys" },
  { id: "design", label: "Design" },
];

export const TEMPLATE_IMPORTERS = {
  card: () => import("../templates/CardCV.jsx"),
  darkdashboard: () => import("../templates/DarkDashboardCV.jsx"),
  darkmode: () => import("../templates/DarkModeCV.jsx"),
  editorial: () => import("../templates/EditorialCV.jsx"),
  editorialpurist: () => import("../templates/EditorialPuristCV.jsx"),
  executive: () => import("../templates/ExecutiveCV.jsx"),
  header: () => import("../templates/HeaderCV.jsx"),
  modernflow: () => import("../templates/ModernFlowCV.jsx"),
  notionstyle: () => import("../templates/NotionStyleCV.jsx"),
  split: () => import("../templates/SplitCV.jsx"),
  splittone: () => import("../templates/SplitToneCV.jsx"),
  terminal: () => import("../templates/TerminalCV.jsx"),
};
