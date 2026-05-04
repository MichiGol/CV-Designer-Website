import { useRef, useState } from "react";
import { A4_HEIGHT_PT, A4_HEIGHT_PX, A4_WIDTH_PT, A4_WIDTH_PX, CSS_PIXELS_PER_INCH } from "../config/pageSizes.js";
import { DEFAULT_CV, DEFAULT_TEMPLATE_SETTINGS } from "../config/defaults.js";
import { FONT_PAIRS } from "../config/layoutConfig.js";

const A4_W = A4_WIDTH_PX;
const A4_H = A4_HEIGHT_PX;
const PDF_TARGET_DPI = 300;
const PDF_EXPORT_SCALE = PDF_TARGET_DPI / CSS_PIXELS_PER_INCH;

const waitForPaint = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

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

let uidSeed = 500;
const uid = () => String(++uidSeed);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function useCVEditor({
  cv: controlledCV,
  setCV: setControlledCV,
  st: controlledSettings,
  setSt: setControlledSettings,
} = {}) {
  // The hook can manage its own state, but the routed page usually passes in
  // localStorage-backed state so the editor survives reloads.
  const [internalCV, setInternalCV] = useState(() => clone(DEFAULT_CV));
  const [internalSt, setInternalSt] = useState(() => ({ ...DEFAULT_TEMPLATE_SETTINGS }));
  const [isExporting, setIsExporting] = useState(false);

  const cv = controlledCV ?? internalCV;
  const setCV = setControlledCV ?? setInternalCV;
  const st = controlledSettings ?? internalSt;
  const setSt = setControlledSettings ?? setInternalSt;

  const photoRef = useRef(null);
  const jsonRef = useRef(null);
  const exportPageRef = useRef(null);
  const exportContentRef = useRef(null);

  const fontPair = FONT_PAIRS[st.fontIdx] ?? FONT_PAIRS[0];
  const displayFont = fontPair.display;
  const bodyFont = fontPair.body;

  const updateSection = (section, value) => {
    setCV(previous => ({ ...previous, [section]: value }));
  };

  const updatePersonal = (field, value) => {
    setCV(previous => ({
      ...previous,
      personal: { ...previous.personal, [field]: value },
    }));
  };

  const addRow = (section, template) => {
    updateSection(section, [...cv[section], { id: uid(), ...template }]);
  };

  const updateRow = (section, id, field, value) => {
    updateSection(
      section,
      cv[section].map(row => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const deleteRow = (section, id) => {
    updateSection(
      section,
      cv[section].filter(row => row.id !== id),
    );
  };

  const handlePhotoUpload = event => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => updatePersonal("photo", loadEvent.target?.result);
    reader.readAsDataURL(file);
  };

  const handleJSONImport = event => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => {
      try {
        setCV(JSON.parse(loadEvent.target?.result));
      } catch {
        // Ignore malformed imports for now.
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const exportPDF = async () => {
    if (!exportPageRef.current || !exportContentRef.current || isExporting) {
      return;
    }

    setIsExporting(true);

    const exportPage = exportPageRef.current;
    const exportContent = exportContentRef.current;
    const previousTransform = exportContent.style.transform;
    const previousOrigin = exportContent.style.transformOrigin;

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      exportContent.style.transform = "none";
      exportContent.style.transformOrigin = "top left";
      await waitForPaint();

      // The hidden export surface stays at true A4 size. We only scale content down
      // if it would vertically overflow that area. Width overflow is often caused
      // by decorative absolute elements and should be clipped, not shrink the page.
      const contentHeight = getExportContentHeight(exportContent);
      const fitScale = contentHeight > A4_H + 2 ? Math.min(1, A4_H / contentHeight) : 1;

      exportContent.style.transform = `scale(${fitScale})`;
      await waitForPaint();

      // html2canvas defaults to devicePixelRatio, which would vary export density
      // between standard and Retina displays. We normalize to an A4 300 DPI target.
      const renderScale = getExportRenderScale();
      const { width: captureWidth, height: captureHeight } = getExportCaptureSize(exportPage);

      const canvas = await html2canvas(exportPage, {
        backgroundColor: window.getComputedStyle(exportPage).backgroundColor || "#ffffff",
        height: captureHeight,
        logging: false,
        scale: renderScale,
        useCORS: true,
        width: captureWidth,
        windowHeight: captureHeight,
        windowWidth: captureWidth,
      });

      const pdfImageCanvas = buildPdfImageCanvas(canvas);
      const pdf = new jsPDF("p", "pt", "a4");
      const imageData = pdfImageCanvas.toDataURL("image/png", 1.0);

      pdf.addImage(imageData, "PNG", 0, 0, A4_WIDTH_PT, A4_HEIGHT_PT, undefined, "NONE");

      const fileName =
        [cv.personal.firstName, cv.personal.lastName]
          .filter(Boolean)
          .join("_")
          .replace(/\s+/g, "_") || "lebenslauf";

      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      // Printing is the fallback path when the browser refuses the canvas/PDF pipeline.
      console.error("PDF export failed:", error);
      window.print();
    } finally {
      exportContent.style.transform = previousTransform;
      exportContent.style.transformOrigin = previousOrigin;
      setIsExporting(false);
    }
  };

  return {
    cv,
    st,
    isExporting,
    displayFont,
    bodyFont,
    setCV,
    setSt,
    updatePersonal,
    updateSection,
    addRow,
    updateRow,
    deleteRow,
    handlePhotoUpload,
    handleJSONImport,
    exportPDF,
    photoRef,
    jsonRef,
    exportPageRef,
    exportContentRef,
  };
}
