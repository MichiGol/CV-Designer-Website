export const DEFAULT_APP_LANGUAGE = "DE";

export const APP_NAV_ITEMS = [
  { to: "/", label: { DE: "Studio", EN: "Studio" }, end: true },
  { to: "/templates", label: { DE: "Vorlagen", EN: "Templates" } },
  { to: "/canvas", label: { DE: "Freiform-Editor", EN: "Freeform Editor" } },
];

export const APP_LANGUAGE_OPTIONS = [
  {
    code: "DE",
    label: { DE: "Deutsch", EN: "German" },
    locale: "de-DE",
  },
  {
    code: "EN",
    label: { DE: "Englisch", EN: "English" },
    locale: "en-GB",
  },
];

export const APP_SHELL_COPY = {
  DE: {
    logo: "CV",
    title: "Lebenslauf Studio",
    subtitle: "Strukturierter Vorlagen- und Freiform-Workflow",
    autosaveChip: "Lokal automatisch gespeichert",
    autosaveToast: "Projekt wurde lokal automatisch gespeichert.",
    languageMenuLabel: "Sprachoptionen",
    languageToggleLabel: "Sprache wechseln",
    loadingWorkspace: "Arbeitsbereich wird geladen...",
    mobileMenuCloseLabel: "Menue schliessen",
    mobileMenuLabel: "Menue oeffnen",
    navigationLabel: "Hauptnavigation",
    resetProjectCancel: "Abbrechen",
    resetProjectConfirm: "Ja, Inhalt zuruecksetzen",
    resetProjectDescription:
      "Alle Inhalte, Vorlagen-Einstellungen und der Freiform-Editor werden wieder auf Max Mustermann und die urspruengliche Gestaltung gesetzt.",
    resetProjectError: "Das Projekt konnte nicht zurueckgesetzt werden. Bitte versuchen Sie es erneut.",
    resetProjectLabel: "Projekt zuruecksetzen",
    resetProjectTitle: "Moechten Sie den Inhalt zuruecksetzen?",
    resetProjectWait: seconds => `Bitte ${seconds}s warten`,
    resetProjectWorking: "Wird zurueckgesetzt...",
  },
  EN: {
    logo: "CV",
    title: "Resume Studio",
    subtitle: "Structured template and freeform workflow",
    autosaveChip: "Saved locally automatically",
    autosaveToast: "Project was saved locally automatically.",
    languageMenuLabel: "Language options",
    languageToggleLabel: "Change language",
    loadingWorkspace: "Loading workspace...",
    mobileMenuCloseLabel: "Close menu",
    mobileMenuLabel: "Open menu",
    navigationLabel: "Main navigation",
    resetProjectCancel: "Cancel",
    resetProjectConfirm: "Yes, reset content",
    resetProjectDescription:
      "All content, template settings, and the freeform editor will return to Max Mustermann and the original design.",
    resetProjectError: "The project could not be reset. Please try again.",
    resetProjectLabel: "Reset project",
    resetProjectTitle: "Do you want to reset the content?",
    resetProjectWait: seconds => `Wait ${seconds}s`,
    resetProjectWorking: "Resetting...",
  },
};
