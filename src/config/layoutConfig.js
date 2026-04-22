export const FONT_PAIRS = [
  {
    label: "Cormorant + DM Sans",
    display: "'Cormorant Garamond',Georgia,serif",
    body: "'DM Sans',system-ui,sans-serif",
  },
  {
    label: "EB Garamond + Lato",
    display: "'EB Garamond',Georgia,serif",
    body: "'Lato',sans-serif",
  },
  {
    label: "System / Neutral",
    display: "system-ui,sans-serif",
    body: "system-ui,sans-serif",
  },
];

export const LANGUAGE_LEVELS = [
  "Muttersprache",
  "Verhandlungssicher (C2)",
  "Fließend (C1)",
  "Fortgeschritten (B2)",
  "Mittelstufe (B1)",
  "Grundkenntnisse (A2)",
];

export const SKILL_LEVELS = [
  "Experte",
  "Fortgeschritten",
  "Gute Kenntnisse",
  "Grundkenntnisse",
];

export const SKILL_LEVEL_VALUE = {
  Experte: 100,
  Fortgeschritten: 80,
  "Gute Kenntnisse": 60,
  Grundkenntnisse: 40,
};

export const FEATURED_TEMPLATE_LAYOUT_IDS = new Set([
  "modernflow",
  "darkdashboard",
  "editorialpurist",
  "terminal",
  "splittone",
  "notionstyle",
]);

export const FIXED_SKILL_DISPLAY_LAYOUT_IDS = new Set([
]);

// If you add a new template, this list is the place where it becomes selectable in the UI.
export const TEMPLATE_LAYOUTS = [
  { id: "modernflow", group: "featured", icon: "MF", label: "Modern Flow", desc: "Zweispaltig + Bogen-Header" },
  { id: "darkdashboard", group: "featured", icon: "DD", label: "Dark Dashboard", desc: "Dark Grid + RadarChart" },
  { id: "editorialpurist", group: "featured", icon: "EP", label: "Editorial Purist", desc: "Serif + hängende Einzüge" },
  { id: "terminal", group: "featured", icon: "TR", label: "Terminal Hacker", desc: "Monospace + CLI-Optik" },
  { id: "splittone", group: "featured", icon: "ST", label: "Split Tone Agency", desc: "Split Screen + Progress Ringe" },
  { id: "notionstyle", group: "featured", icon: "NS", label: "Notion Style", desc: "Workspace Look + Kartenblöcke" },
  { id: "wave", group: "header", icon: "〰", label: "Welle", desc: "Header + Welle" },
  { id: "diagonal", group: "header", icon: "◤", label: "Diagonal", desc: "Header + Schnitt" },
  { id: "arch", group: "header", icon: "⌒", label: "Bogen", desc: "Header + Bogen" },
  { id: "split", group: "column", icon: "▐", label: "Zweiteilig", desc: "Ganzseitige Seitenleiste" },
  { id: "executive", group: "column", icon: "▬", label: "Klassisch", desc: "Puristische Einspaltigkeit" },
  { id: "card", group: "column", icon: "⊞", label: "Kartenraster", desc: "Modulares Karten-Layout" },
  { id: "darkmode", group: "special", icon: "◑", label: "Dunkel", desc: "Dunkles Design" },
  { id: "editorial", group: "special", icon: "𝕸", label: "Magazin", desc: "Editorialer Stil" },
];

export const LAYOUT_GROUPS = [
  { key: "featured", label: "Neue Vorlagen" },
  { key: "header", label: "Header-Stil" },
  { key: "column", label: "Spalten-Layout" },
  { key: "special", label: "Spezial" },
];

export const SKILL_DISPLAY_OPTIONS = [
  { id: "chips", icon: "⬡", label: "Chips" },
  { id: "bars", icon: "▬", label: "Balken" },
  { id: "radar", icon: "◎", label: "Radar" },
];

export const HEADER_LAYOUT_IDS = new Set(["wave", "diagonal", "arch"]);

export const ELEMENT_TYPE_META = {
  text: { icon: "T", label: "Textfeld" },
  rect: { icon: "▭", label: "Rechteck" },
  ellipse: { icon: "○", label: "Kreis" },
  line: { icon: "—", label: "Linie" },
  image: { icon: "Img", label: "Bild" },
};

export function getElementTypeMeta(type) {
  return ELEMENT_TYPE_META[type] ?? { icon: "•", label: "Element" };
}
