export const DEFAULT_CV = {
  personal: {
    firstName: "Max",
    lastName: "Mustermann",
    title: "Senior Softwarearchitekt",
    email: "m.berger@techmail.de",
    phone: "+49 89 123 456 78",
    address: "München, Bayern",
    website: "maxberger.dev",
    summary:
      "Visionärer Softwarearchitekt mit über 10 Jahren Erfahrung in der Entwicklung skalierbarer Cloud-Systeme. Leidenschaftlich für Clean Code, agile Methoden und die Mentoring-Kultur.",
    photo: null,
    photoScale: 1,
    photoPositionX: 50,
    photoPositionY: 50,
  },
  education: [
    {
      id: "e1",
      institution: "Technische Universität München",
      degree: "M.Sc. Informatik",
      start: "2011",
      end: "2013",
      grade: "1,3",
      description: "Schwerpunkt: Verteilte Systeme und maschinelles Lernen.",
    },
  ],
  experience: [
    {
      id: "x1",
      company: "CloudSphere GmbH",
      role: "Leitender Softwarearchitekt",
      start: "2019",
      end: "Heute",
      description:
        "Entwurf einer Microservices-Plattform für 2M+ Nutzer. Technische Leitung eines 12-köpfigen Teams. Einführung von DevOps-Kultur und CI/CD-Pipelines.",
    },
    {
      id: "x2",
      company: "ByteForge AG",
      role: "Senior-Backend-Entwickler",
      start: "2015",
      end: "2019",
      description:
        "Entwicklung hochperformanter APIs in Go und Node.js. Datenbankoptimierung, Caching-Strategien mit Redis.",
    },
  ],
  skills: [
    { id: "s1", name: "React / TypeScript", level: "Experte" },
    { id: "s2", name: "Node.js / Go", level: "Fortgeschritten" },
    { id: "s3", name: "Docker / Kubernetes", level: "Fortgeschritten" },
    { id: "s4", name: "AWS / Azure", level: "Gute Kenntnisse" },
    { id: "s5", name: "PostgreSQL / Redis", level: "Experte" },
  ],
  languages: [
    { id: "l1", name: "Deutsch", level: "Muttersprache" },
    { id: "l2", name: "Englisch", level: "Verhandlungssicher (C2)" },
    { id: "l3", name: "Spanisch", level: "Mittelstufe (B1)" },
  ],
  hobbies: ["Open-Source-Projekte", "Bergsteigen", "Fotografie", "Schach", "Espresso"],
};

export const DEFAULT_TEMPLATE_SETTINGS = {
  fontIdx: 0,
  size: 13,
  accent: "#1e3a5f",
  layout: "wave",
  sidebarSide: "right",
  skillDisplay: "chips",
};
