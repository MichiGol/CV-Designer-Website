import { useCallback, useRef, useState } from "react";

import {
  A4_HEIGHT_PT,
  A4_HEIGHT_PX,
  A4_WIDTH_PT,
  A4_WIDTH_PX,
  CSS_PIXELS_PER_INCH,
} from "../config/pageSizes.js";

const PDF_TARGET_DPI = 300;
const PDF_EXPORT_SCALE = PDF_TARGET_DPI / CSS_PIXELS_PER_INCH;
const DEFAULT_CANVAS_PDF_FILENAME = "lebenslauf-freiform.pdf";

const waitForPaint = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

function getRenderScale() {
  const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const targetWidth = Math.ceil((A4_WIDTH_PX * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;
  const targetHeight = Math.ceil((A4_HEIGHT_PX * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;

  return Math.max(targetWidth / A4_WIDTH_PX, targetHeight / A4_HEIGHT_PX);
}

function getExportCaptureSize(root) {
  const rect = root.getBoundingClientRect();

  return {
    height: Math.round(rect.height) || A4_HEIGHT_PX,
    width: Math.round(rect.width) || A4_WIDTH_PX,
  };
}

function buildPdfCanvas(sourceCanvas) {
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

async function waitForImages(root) {
  const images = Array.from(root.querySelectorAll("img"));

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

export function useCanvasPdfExport({ fileName = DEFAULT_CANVAS_PDF_FILENAME } = {}) {
  const [isExporting, setIsExporting] = useState(false);
  const exportPageRef = useRef(null);
  const exportLockRef = useRef(false);

  const exportPdf = useCallback(async () => {
    if (!exportPageRef.current || exportLockRef.current) {
      return;
    }

    exportLockRef.current = true;
    setIsExporting(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await waitForImages(exportPageRef.current);
      await waitForPaint();

      const { width: captureWidth, height: captureHeight } = getExportCaptureSize(exportPageRef.current);
      const canvas = await html2canvas(exportPageRef.current, {
        backgroundColor: window.getComputedStyle(exportPageRef.current).backgroundColor || "#ffffff",
        height: captureHeight,
        logging: false,
        scale: getRenderScale(),
        useCORS: true,
        width: captureWidth,
        windowHeight: captureHeight,
        windowWidth: captureWidth,
      });

      const pdfImageCanvas = buildPdfCanvas(canvas);
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
      pdf.save(fileName);
    } catch (error) {
      console.error("Canvas PDF export failed:", error);
    } finally {
      exportLockRef.current = false;
      setIsExporting(false);
    }
  }, [fileName]);

  return {
    exportPageRef,
    exportPdf,
    isExporting,
  };
}
