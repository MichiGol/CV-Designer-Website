import { TEMPLATE_LAYOUTS } from "./layoutConfig.js";

const templateCount = TEMPLATE_LAYOUTS.length;

export const LANDING_COPY = {
  DE: {
    hero: {
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
    },
    highlights: [
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
    ],
    gallery: {
      overline: "Layout-Galerie",
      title:
        "Blaettern Sie durch alle Layouts, vergleichen Sie ihre Wirkung und oeffnen Sie den Vorlagen-Editor direkt mit der exakt ausgewaehlten Variante.",
      chip: "Manuelle Vor- und Zurueck-Steuerung",
    },
    workflow: {
      overline: "Studio-Uebersicht",
      cards: [
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
      ],
    },
    cta: {
      overline: "Bereit zum Start",
      title: "Starten Sie strukturiert, bleiben Sie flexibel und behalten Sie Ihren Arbeitsstand jederzeit.",
      description:
        "Die geroutete Oberflaeche schafft eine klare Informationsarchitektur und haelt Ihre leistungsstarken Editor-Funktionen genau dort, wo sie gebraucht werden.",
      actionOverline: "Direkter Einstieg",
      recommended: "Empfohlen",
      alternative: "Alternative",
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
    },
  },
  EN: {
    hero: {
      badge: "Professional multi-page resume studio",
      title: "Create polished resumes in a guided workflow instead of a simple template switcher.",
      description:
        "The introduction page frames the studio, the template route handles structured editing, and the freeform editor is ready when you need full layout freedom. Local persistence keeps your work safely in place.",
      primaryAction: {
        label: "Start with templates",
        to: "/templates",
      },
      secondaryAction: {
        label: "Open freeform editor",
        to: "/canvas",
      },
    },
    highlights: [
      {
        metric: `${templateCount}`,
        title: "Layout variants",
        description: `${templateCount} curated design directions you can compare before you start editing.`,
      },
      {
        metric: "A4",
        title: "Centered preview",
        description: "Both editors keep the document canvas cleanly centered and stable across screen sizes.",
      },
      {
        metric: "PDF",
        title: "Export ready",
        description: "The existing html2canvas and PDF workflow remains fully intact and ready to use.",
      },
    ],
    gallery: {
      overline: "Layout gallery",
      title:
        "Browse every layout, compare its visual impact, and open the template editor with the exact variant you selected.",
      chip: "Manual previous and next controls",
    },
    workflow: {
      overline: "Studio overview",
      cards: [
        {
          eyebrow: "01",
          title: "Choose the right starting point",
          description: "Compare layout styles directly on the introduction page and open the template that fits.",
        },
        {
          eyebrow: "02",
          title: "Refine content with structure",
          description: "Edit data, typography, and layout quickly and deliberately inside the template editor.",
        },
        {
          eyebrow: "03",
          title: "Finish with free design",
          description: "Move into the freeform editor when you need precise positioning without losing your work.",
        },
      ],
    },
    cta: {
      overline: "Ready to start",
      title: "Start with structure, stay flexible, and keep your work available at every step.",
      description:
        "The routed interface creates a clear information architecture and keeps the powerful editor features exactly where they are needed.",
      actionOverline: "Direct entry",
      recommended: "Recommended",
      alternative: "Alternative",
      primaryAction: {
        label: "Open template editor",
        to: "/templates",
        hint: "Guided editing with layout selection and live preview.",
      },
      secondaryAction: {
        label: "Open freeform editor",
        to: "/canvas",
        hint: "Freely place text, shapes, and layers on A4.",
      },
    },
  },
};
