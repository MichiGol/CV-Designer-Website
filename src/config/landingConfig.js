import { TEMPLATE_LAYOUTS } from "./layoutConfig.js";

const templateCount = TEMPLATE_LAYOUTS.length;

export const LANDING_HERO = {
  badge: "Professionelles mehrseitiges CV-Studio",
  title: "Erstellen Sie hochwertige Lebenslaeufe in einem klar gefuehrten Workflow statt in einem simplen Umschalter.",
  description:
    "Die Startseite fuehrt in das Studio ein, die Vorlagenroute uebernimmt die strukturierte Bearbeitung und der Freiform-Editor steht bereit, sobald Sie vollstaendige Freiheit im Layout brauchen. Die lokale Persistenz haelt Ihren Arbeitsstand dabei nahtlos fest.",
  primaryAction: {
    label: "Mit Vorlagen starten",
    to: "/templates",
  },
  secondaryAction: {
    label: "Zum Freiform-Editor wechseln",
    to: "/canvas",
  },
};

export const STUDIO_HIGHLIGHTS = [
  {
    metric: `${templateCount}`,
    title: "Layoutvarianten",
    description: `${templateCount} kuratierte Gestaltungsrichtungen, die Sie vor dem Einstieg direkt vergleichen koennen.`,
  },
  {
    metric: "A4",
    title: "Zentrierte Vorschau",
    description: "Beide Editoren halten die Dokumentenflaeche sauber zentriert und reagieren stabil auf jede Bildschirmgroesse.",
  },
  {
    metric: "PDF",
    title: "Exportbereit",
    description: "Der bestehende html2canvas- und PDF-Workflow bleibt vollstaendig erhalten und ist sofort einsatzbereit.",
  },
];

export const LANDING_GALLERY = {
  overline: "Layout-Galerie",
  title:
    "Blaettern Sie durch alle Layouts, vergleichen Sie ihre Wirkung und oeffnen Sie den Vorlagen-Editor direkt mit der exakt ausgewaehlten Variante.",
  chip: "Manuelle Vor- und Zurueck-Steuerung",
};

export const LANDING_WORKFLOW = {
  overline: "Studio-Uebersicht",
};

export const WORKFLOW_CARDS = [
  {
    eyebrow: "01",
    title: "Passenden Einstieg waehlen",
    description: "Vergleichen Sie Layoutstile direkt auf der Startseite und oeffnen Sie gezielt die passende Vorlage.",
  },
  {
    eyebrow: "02",
    title: "Inhalte strukturiert verfeinern",
    description: "Pflegen Sie Daten, Typografie und Aufbau im Vorlagen-Editor schnell und kontrolliert ein.",
  },
  {
    eyebrow: "03",
    title: "Mit freier Gestaltung abschliessen",
    description: "Wechseln Sie in den Freiform-Editor, sobald Sie freie Positionierung brauchen, ohne Ihren Stand zu verlieren.",
  },
];

export const LANDING_CTA = {
  overline: "Bereit zum Start",
  title: "Starten Sie strukturiert, bleiben Sie flexibel und behalten Sie Ihren Arbeitsstand jederzeit.",
  description:
    "Die geroutete Oberflaeche schafft eine klare Informationsarchitektur und haelt Ihre leistungsstarken Editor-Funktionen genau dort, wo sie gebraucht werden.",
  actionOverline: "Direkter Einstieg",
  primaryAction: {
    label: "Vorlagen-Editor oeffnen",
    to: "/templates",
    hint: "Gefuehrte Bearbeitung mit Layout-Auswahl und Live-Vorschau.",
  },
  secondaryAction: {
    label: "Freiform-Editor oeffnen",
    to: "/canvas",
    hint: "Freies Platzieren von Text, Formen und Ebenen auf A4.",
  },
};
