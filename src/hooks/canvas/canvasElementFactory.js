import { A4_H, A4_W, TYPE_DEFAULTS } from "./canvasEditor.constants.js";

let uidSeed = 1000;

export const newId = () => `el_${++uidSeed}`;

export function syncElementIdSeed(elements) {
  const maxSeed = elements.reduce((max, element) => {
    const match = `${element.id ?? ""}`.match(/^el_(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, uidSeed);

  uidSeed = Math.max(uidSeed, maxSeed);
}

export function cloneElements(elements) {
  return elements.map(element => ({ ...element }));
}

export function createElement(type, overrides = {}) {
  return {
    id: newId(),
    type,
    x: 80,
    y: 80,
    zIndex: 1,
    opacity: 1,
    locked: false,
    ...TYPE_DEFAULTS[type],
    ...overrides,
  };
}

export const SPLIT_TEMPLATE = () => [
  // This seed layout is used both for first load and for "reset to template".
  createElement("rect", { id: "r_bg", x: 0, y: 0, width: A4_W, height: A4_H, color: "#ffffff", zIndex: 0, locked: true }),
  createElement("rect", { id: "r_top", x: 0, y: 0, width: A4_W, height: 150, color: "#1e3a5f", zIndex: 1, locked: true }),
  createElement("ellipse", { id: "e_glow", x: 560, y: -60, width: 220, height: 220, color: "#ffffff18", zIndex: 1, locked: true }),
  createElement("rect", { id: "r_side", x: 0, y: 150, width: 206, height: 973, color: "#f8fafc", zIndex: 1, locked: true }),
  createElement("text", { id: "t_name", x: 238, y: 54, width: 420, height: 42, content: "MAX MUSTERMANN", fontSize: 30, fontWeight: "700", color: "#ffffff", bgColor: "transparent", fontFamily: "'Cormorant Garamond',Georgia,serif", zIndex: 3 }),
  createElement("text", { id: "t_role", x: 240, y: 102, width: 320, height: 18, content: "Senior Softwarearchitekt", fontSize: 13, fontWeight: "400", color: "#dbeafe", bgColor: "transparent", zIndex: 3 }),
  createElement("rect", { id: "r_photo", x: 38, y: 32, width: 120, height: 120, color: "#ffffff18", borderColor: "#ffffff40", borderWidth: 2, borderRadius: 16, zIndex: 2 }),
  createElement("text", { id: "t_init", x: 56, y: 70, width: 84, height: 32, content: "MM", fontSize: 32, fontWeight: "700", color: "#ffffff", bgColor: "transparent", fontFamily: "'Cormorant Garamond',Georgia,serif", textAlign: "center", zIndex: 3 }),
  createElement("text", { id: "s_lab1", x: 28, y: 192, width: 150, height: 14, content: "KONTAKT", fontSize: 9, fontWeight: "700", color: "#1e3a5f", bgColor: "transparent", zIndex: 3 }),
  createElement("line", { id: "s_lin1", x: 28, y: 212, width: 150, height: 1, color: "#dbe4f0", zIndex: 3 }),
  createElement("text", { id: "s_txt1", x: 28, y: 224, width: 150, height: 84, content: "m.berger@techmail.de\n+49 89 123 456 78\nM\u00fcnchen, Bayern\nmaxberger.dev", fontSize: 11, lineHeight: 1.75, color: "#475569", bgColor: "transparent", zIndex: 3 }),
  createElement("text", { id: "s_lab2", x: 28, y: 350, width: 150, height: 14, content: "F\u00c4HIGKEITEN", fontSize: 9, fontWeight: "700", color: "#1e3a5f", bgColor: "transparent", zIndex: 3 }),
  createElement("line", { id: "s_lin2", x: 28, y: 370, width: 150, height: 1, color: "#dbe4f0", zIndex: 3 }),
  createElement("text", { id: "s_txt2", x: 28, y: 382, width: 150, height: 150, content: "React / TypeScript\nNode.js / Go\nDocker / Kubernetes\nAWS / Azure\nPostgreSQL / Redis", fontSize: 11, lineHeight: 1.75, color: "#475569", bgColor: "transparent", zIndex: 3 }),
  createElement("text", { id: "m_suml", x: 244, y: 210, width: 520, height: 14, content: "PROFIL", fontSize: 8, fontWeight: "700", color: "#1e3a5f", bgColor: "transparent", zIndex: 4 }),
  createElement("line", { id: "m_sumr", x: 244, y: 228, width: 520, height: 1, color: "#e2e8f0", zIndex: 4 }),
  createElement("text", { id: "m_sumb", x: 244, y: 236, width: 520, height: 88, content: "Vision\u00e4rer Softwarearchitekt mit \u00fcber 10 Jahren Erfahrung in der Entwicklung skalierbarer Cloud-Systeme. Leidenschaftlich f\u00fcr Clean Code, agile Methoden und eine starke Mentoring-Kultur.", fontSize: 11, color: "#475569", bgColor: "transparent", zIndex: 4, lineHeight: 1.7 }),
  createElement("text", { id: "m_exlbl", x: 244, y: 340, width: 520, height: 14, content: "BERUFSERFAHRUNG", fontSize: 8, fontWeight: "700", color: "#1e3a5f", bgColor: "transparent", zIndex: 4 }),
  createElement("line", { id: "m_exrul", x: 244, y: 358, width: 520, height: 1, color: "#e2e8f0", zIndex: 4 }),
  createElement("text", { id: "m_ex1r", x: 244, y: 366, width: 380, height: 20, content: "Leitender Softwarearchitekt", fontSize: 13, fontWeight: "700", color: "#0f172a", bgColor: "transparent", zIndex: 4 }),
  createElement("text", { id: "m_ex1p", x: 580, y: 366, width: 184, height: 18, content: "2019 - Heute", fontSize: 10, color: "#94a3b8", bgColor: "transparent", zIndex: 4, textAlign: "right" }),
  createElement("text", { id: "m_ex1c", x: 244, y: 386, width: 280, height: 18, content: "CloudSphere GmbH", fontSize: 11, fontWeight: "600", color: "#1e3a5f", bgColor: "transparent", zIndex: 4 }),
  createElement("text", { id: "m_ex1b", x: 244, y: 408, width: 520, height: 64, content: "Entwurf einer Microservices-Plattform f\u00fcr 2M+ Nutzer. Technische Leitung eines 12-k\u00f6pfigen Teams.", fontSize: 11, color: "#475569", bgColor: "transparent", zIndex: 4, lineHeight: 1.65 }),
];
