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
  {
    label: "Space Grotesk + Inter",
    display: "'Space Grotesk',system-ui,sans-serif",
    body: "'Inter',system-ui,sans-serif",
  },
  {
    label: "Fraunces + Manrope",
    display: "'Fraunces',Georgia,serif",
    body: "'Manrope',system-ui,sans-serif",
  },
  {
    label: "Archivo Black + JetBrains Mono",
    display: "'Archivo Black','Arial Black',system-ui,sans-serif",
    body: "'JetBrains Mono','IBM Plex Mono','Space Mono',monospace",
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

export const LANGUAGE_LEVEL_LABELS = {
  Muttersprache: { DE: "Muttersprache", EN: "Native" },
  "Verhandlungssicher (C2)": { DE: "Verhandlungssicher (C2)", EN: "Proficient (C2)" },
  "Fließend (C1)": { DE: "Fließend (C1)", EN: "Fluent (C1)" },
  "Fortgeschritten (B2)": { DE: "Fortgeschritten (B2)", EN: "Upper intermediate (B2)" },
  "Mittelstufe (B1)": { DE: "Mittelstufe (B1)", EN: "Intermediate (B1)" },
  "Grundkenntnisse (A2)": { DE: "Grundkenntnisse (A2)", EN: "Basic (A2)" },
};

export const SKILL_LEVELS = [
  "Experte",
  "Fortgeschritten",
  "Gute Kenntnisse",
  "Grundkenntnisse",
];

export const SKILL_LEVEL_LABELS = {
  Experte: { DE: "Experte", EN: "Expert" },
  Fortgeschritten: { DE: "Fortgeschritten", EN: "Advanced" },
  "Gute Kenntnisse": { DE: "Gute Kenntnisse", EN: "Good knowledge" },
  Grundkenntnisse: { DE: "Grundkenntnisse", EN: "Basic knowledge" },
};

export const SKILL_LEVEL_VALUE = {
  Experte: 100,
  Fortgeschritten: 80,
  "Gute Kenntnisse": 60,
  Grundkenntnisse: 40,
};

export const FEATURED_TEMPLATE_LAYOUT_IDS = new Set([
  "noirparisian",
  "swisssignal",
  "bauhausblocks",
  "auroradusk",
  "printguild",
  "obsidianedge",
  "modernflow",
  "darkdashboard",
  "editorialpurist",
  "terminal",
  "splittone",
  "notionstyle",
]);

export const FIXED_SKILL_DISPLAY_LAYOUT_IDS = new Set([]);

export const TEMPLATE_LAYOUTS = [
  { id: "noirparisian", group: "featured", icon: "NP", label: "Noir Parisian", desc: { DE: "Dunkles Editorial + Goldlinie", EN: "Dark editorial + gold rule" } },
  { id: "swisssignal", group: "featured", icon: "SS", label: "Swiss Signal", desc: { DE: "Rotes Raster + Schweizer Klarheit", EN: "Red grid + Swiss clarity" } },
  { id: "bauhausblocks", group: "featured", icon: "BB", label: "Bauhaus Blocks", desc: { DE: "Gelb-schwarze Geometrie", EN: "Yellow-black geometry" } },
  { id: "auroradusk", group: "featured", icon: "AD", label: "Aurora Dusk", desc: { DE: "Gradient + weiche Karten", EN: "Gradient + soft cards" } },
  { id: "printguild", group: "featured", icon: "PG", label: "Print Guild", desc: { DE: "Zeitungssatz + Papiertextur", EN: "Newspaper layout + paper texture" } },
  { id: "obsidianedge", group: "featured", icon: "OE", label: "Obsidian Edge", desc: { DE: "Schwarz + Champagner-Akzente", EN: "Black + champagne accents" } },
  { id: "modernflow", group: "featured", icon: "MF", label: "Modern Flow", desc: { DE: "Zweispaltig + Bogen-Header", EN: "Two-column + arched header" } },
  { id: "darkdashboard", group: "featured", icon: "DD", label: "Dark Dashboard", desc: { DE: "Dark Grid + RadarChart", EN: "Dark grid + radar chart" } },
  { id: "editorialpurist", group: "featured", icon: "EP", label: "Editorial Purist", desc: { DE: "Serif + haengende Einzuege", EN: "Serif + hanging indents" } },
  { id: "terminal", group: "featured", icon: "TR", label: "Terminal Hacker", desc: { DE: "Monospace + CLI-Optik", EN: "Monospace + CLI styling" } },
  { id: "splittone", group: "featured", icon: "ST", label: "Split Tone Agency", desc: { DE: "Split Screen + Progress Ringe", EN: "Split screen + progress rings" } },
  { id: "notionstyle", group: "featured", icon: "NS", label: "Notion Style", desc: { DE: "Workspace Look + Kartenbloecke", EN: "Workspace look + card blocks" } },
  { id: "wave", group: "header", icon: "W", label: { DE: "Welle", EN: "Wave" }, desc: { DE: "Header + Welle", EN: "Header + wave" } },
  { id: "diagonal", group: "header", icon: "D", label: "Diagonal", desc: { DE: "Header + Schnitt", EN: "Header + diagonal cut" } },
  { id: "arch", group: "header", icon: "A", label: { DE: "Bogen", EN: "Arch" }, desc: { DE: "Header + Bogen", EN: "Header + arch" } },
  { id: "split", group: "column", icon: "S", label: { DE: "Zweiteilig", EN: "Split" }, desc: { DE: "Ganzseitige Seitenleiste", EN: "Full-height sidebar" } },
  { id: "executive", group: "column", icon: "E", label: { DE: "Klassisch", EN: "Classic" }, desc: { DE: "Puristische Einspaltigkeit", EN: "Minimal single-column layout" } },
  { id: "card", group: "column", icon: "C", label: { DE: "Kartenraster", EN: "Card Grid" }, desc: { DE: "Modulares Karten-Layout", EN: "Modular card layout" } },
  { id: "darkmode", group: "special", icon: "DM", label: { DE: "Dunkel", EN: "Dark" }, desc: { DE: "Dunkles Design", EN: "Dark design" } },
  { id: "editorial", group: "special", icon: "M", label: { DE: "Magazin", EN: "Magazine" }, desc: { DE: "Editorialer Stil", EN: "Editorial style" } },
];

export const LAYOUT_GROUPS = [
  { key: "featured", label: { DE: "Neue Vorlagen", EN: "New Templates" } },
  { key: "header", label: { DE: "Header-Stil", EN: "Header Style" } },
  { key: "column", label: { DE: "Spalten-Layout", EN: "Column Layout" } },
  { key: "special", label: { DE: "Spezial", EN: "Special" } },
];

export const SKILL_DISPLAY_OPTIONS = [
  { id: "chips", icon: "C", label: { DE: "Chips", EN: "Chips" } },
  { id: "bars", icon: "B", label: { DE: "Balken", EN: "Bars" } },
  { id: "radar", icon: "R", label: { DE: "Radar", EN: "Radar" } },
];

export const HEADER_LAYOUT_IDS = new Set(["wave", "diagonal", "arch"]);

export const SIDEBAR_POSITION_LAYOUT_IDS = new Set([
  ...HEADER_LAYOUT_IDS,
  "noirparisian",
  "swisssignal",
  "bauhausblocks",
  "auroradusk",
  "printguild",
  "obsidianedge",
]);

export const ELEMENT_TYPE_META = {
  text: { icon: "T", label: { DE: "Textfeld", EN: "Text Box" } },
  rect: { icon: "R", label: { DE: "Rechteck", EN: "Rectangle" } },
  ellipse: { icon: "O", label: { DE: "Kreis", EN: "Circle" } },
  line: { icon: "-", label: { DE: "Linie", EN: "Line" } },
  image: { icon: "Img", label: { DE: "Bild", EN: "Image" } },
};

function localize(value, languageCode = "DE") {
  return typeof value === "string" ? value : value?.[languageCode] ?? value?.DE ?? "";
}

export function getLocalizedLayout(layout, languageCode = "DE") {
  return {
    ...layout,
    desc: localize(layout.desc, languageCode),
    label: localize(layout.label, languageCode) || layout.label,
  };
}

export function getLocalizedLayoutGroup(group, languageCode = "DE") {
  return {
    ...group,
    label: localize(group.label, languageCode),
  };
}

export function getElementTypeMeta(type, languageCode = "DE") {
  const meta = ELEMENT_TYPE_META[type] ?? { icon: "E", label: { DE: "Element", EN: "Element" } };

  return {
    ...meta,
    label: localize(meta.label, languageCode),
  };
}
