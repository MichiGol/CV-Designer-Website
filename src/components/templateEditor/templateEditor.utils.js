import { TEMPLATE_COLOR_DEFAULTS } from "../../config/defaults.js";
import { HEADER_LAYOUT_IDS } from "../../config/layoutConfig.js";
import { A4_H, A4_W, TEMPLATE_IMPORTERS } from "./templateEditor.constants.js";

export const waitForPaint = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

async function waitForImages(root) {
  const images = Array.from(root?.querySelectorAll("img") ?? []);

  await Promise.all(
    images.map(image => {
      if (image.complete) {
        return image.decode?.().catch(() => {}) ?? Promise.resolve();
      }

      return new Promise(resolve => {
        const handleReady = () => {
          const decodePromise = image.decode?.().catch(() => {});

          if (decodePromise) {
            decodePromise.finally(resolve);
            return;
          }

          resolve();
        };

        image.addEventListener("load", handleReady, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }),
  );
}

export function getAccentCssVariables(accent) {
  return {
    "--template-editor-accent": accent,
    "--template-editor-accent-soft": `${accent}18`,
    "--template-editor-accent-strong": `${accent}40`,
    "--template-editor-accent-shadow": `${accent}50`,
  };
}

function getExportWidth({ exportContent, exportPage }) {
  const pageRect = exportPage.getBoundingClientRect();

  return Math.max(
    Math.round(pageRect.width) || 0,
    exportPage.scrollWidth,
    exportContent.scrollWidth,
    A4_W,
  );
}

export function getPageBackground(layoutId, bodyBg) {
  const templateDefaults = TEMPLATE_COLOR_DEFAULTS[layoutId];

  if (templateDefaults) {
    return bodyBg || templateDefaults.bodyBg;
  }

  if (layoutId === "card") {
    return "#f0f4f8";
  }

  if (layoutId === "printguild") {
    return "#f2ead8";
  }

  if (layoutId === "auroradusk") {
    return "#f5f3ff";
  }

  if (layoutId === "noirparisian") {
    return "#faf8f3";
  }

  if (layoutId === "obsidianedge") {
    return "#f9f7f4";
  }

  if (layoutId === "darkmode" || layoutId === "darkdashboard" || layoutId === "terminal") {
    return "#020617";
  }

  return "#ffffff";
}

export function getResumeFileName(snapshot) {
  return (
    [snapshot.cv.personal.firstName, snapshot.cv.personal.lastName]
      .filter(Boolean)
      .join("_")
      .replace(/\s+/g, "_") || "lebenslauf"
  );
}

export async function waitForSurfaceReady(root) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitForImages(root);
  await waitForPaint();
}

export async function ensureTemplateLoaded(layoutId) {
  if (HEADER_LAYOUT_IDS.has(layoutId)) {
    await TEMPLATE_IMPORTERS.header();
    return;
  }

  const importTemplate = TEMPLATE_IMPORTERS[layoutId];

  if (importTemplate) {
    await importTemplate();
  }
}

export async function exportPreviewSurfaceAsPdf({ exportContent, exportPage, fileName }) {
  const detachedSurface = exportPage.parentElement;
  const { default: html2pdfModule } = await import("html2pdf.js");
  const html2pdf = html2pdfModule?.default ?? html2pdfModule;

  try {
    exportPage.classList.add("pdf-export-mode");
    exportContent.classList.add("pdf-export-mode-content");

    if (detachedSurface instanceof HTMLElement) {
      detachedSurface.classList.add("pdf-export-surface-mode");
    }

    await waitForSurfaceReady(exportPage);

    const captureWidth = getExportWidth({
      exportContent,
      exportPage,
    });
    const backgroundColor = window.getComputedStyle(exportPage).backgroundColor || "#ffffff";
    await waitForSurfaceReady(exportPage);
    await html2pdf()
      .set({
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        margin: [0, 0, 15, 0],
        pagebreak: {
          avoid: [".cv-pdf-avoid-break", ".pdf-avoid-break"],
          before: ".cv-pdf-break-before",
          after: ".cv-pdf-break-after",
          mode: ["css", "legacy"],
        },
        html2canvas: {
          backgroundColor,
          logging: false,
          scale: 1.5,
          useCORS: true,
          windowWidth: captureWidth,
        },
        jsPDF: {
          compress: true,
          format: "a4",
          orientation: "portrait",
          unit: "mm",
        },
      })
      .from(exportPage)
      .save();
  } finally {
    exportPage.classList.remove("pdf-export-mode");
    exportContent.classList.remove("pdf-export-mode-content");

    if (detachedSurface instanceof HTMLElement) {
      detachedSurface.classList.remove("pdf-export-surface-mode");
    }
  }
}
