import { HEADER_LAYOUT_IDS } from "../../config/layoutConfig.js";
import { A4_HEIGHT_PT, A4_WIDTH_PT, CSS_PIXELS_PER_INCH } from "../../config/pageSizes.js";
import { A4_H, A4_W, TEMPLATE_IMPORTERS } from "./templateEditor.constants.js";

const PDF_TARGET_DPI = 300;
const PDF_EXPORT_SCALE = PDF_TARGET_DPI / CSS_PIXELS_PER_INCH;

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

function getExportRenderScale() {
  const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const targetWidth = Math.ceil((A4_W * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;
  const targetHeight = Math.ceil((A4_H * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;

  return Math.max(targetWidth / A4_W, targetHeight / A4_H);
}

function getExportCaptureSize(root) {
  const rect = root.getBoundingClientRect();

  return {
    height: Math.round(rect.height) || A4_H,
    width: Math.round(rect.width) || A4_W,
  };
}

function getExportContentHeight(exportContent) {
  const exportRoot = exportContent.firstElementChild;

  return Math.max(
    exportRoot?.scrollHeight ?? 0,
    exportRoot?.offsetHeight ?? 0,
    exportContent.scrollHeight,
    exportContent.offsetHeight,
    A4_H,
  );
}

function buildPdfImageCanvas(sourceCanvas) {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = sourceCanvas.width;
  outputCanvas.height = sourceCanvas.height;

  const context = outputCanvas.getContext("2d", { alpha: false });

  if (!context) {
    return sourceCanvas;
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
  context.imageSmoothingEnabled = false;

  if ("imageSmoothingQuality" in context) {
    context.imageSmoothingQuality = "high";
  }

  context.drawImage(sourceCanvas, 0, 0);
  return outputCanvas;
}

export function getPageBackground(layoutId) {
  if (layoutId === "card") {
    return "#f0f4f8";
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
  const previousTransform = exportContent.style.transform;
  const previousOrigin = exportContent.style.transformOrigin;
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  try {
    exportContent.style.transform = "none";
    exportContent.style.transformOrigin = "top left";
    await waitForSurfaceReady(exportPage);

    const contentHeight = getExportContentHeight(exportContent);
    const fitScale = contentHeight > A4_H + 2 ? Math.min(1, A4_H / contentHeight) : 1;

    exportContent.style.transform = `scale(${fitScale})`;
    await waitForSurfaceReady(exportPage);

    const { width: captureWidth, height: captureHeight } = getExportCaptureSize(exportPage);
    const canvas = await html2canvas(exportPage, {
      backgroundColor: window.getComputedStyle(exportPage).backgroundColor || "#ffffff",
      height: captureHeight,
      logging: false,
      scale: getExportRenderScale(),
      useCORS: true,
      width: captureWidth,
      windowHeight: captureHeight,
      windowWidth: captureWidth,
    });

    const pdfImageCanvas = buildPdfImageCanvas(canvas);
    const pdf = new jsPDF("p", "pt", "a4");

    pdf.addImage(
      pdfImageCanvas.toDataURL("image/png", 1.0),
      "PNG",
      0,
      0,
      A4_WIDTH_PT,
      A4_HEIGHT_PT,
      undefined,
      "NONE",
    );
    pdf.save(`${fileName}.pdf`);
  } finally {
    exportContent.style.transform = previousTransform;
    exportContent.style.transformOrigin = previousOrigin;
  }
}
