import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { transferTemplateToCanvas } from "../utils/templateToCanvas.js";
import {
  exportPreviewSurfaceAsPdf,
  getResumeFileName,
} from "../components/templateEditor/templateEditor.utils.js";
import { useDetachedTemplateSurface } from "./templateEditor/useDetachedTemplateSurface.js";
import { useTemplateFileHandlers } from "./templateEditor/useTemplateFileHandlers.js";

async function exportTemplatePdf({
  exportContent,
  exportPage,
  mountDetachedSurface,
  printDetachedSurface,
  unmountDetachedSurface,
}) {
  const snapshot = await mountDetachedSurface();

  if (!exportPage.current || !exportContent.current) {
    return;
  }

  try {
    await exportPreviewSurfaceAsPdf({
      exportContent: exportContent.current,
      exportPage: exportPage.current,
      fileName: getResumeFileName(snapshot),
    });
  } catch (error) {
    console.error("PDF export failed. Falling back to browser print.", error);
    await printDetachedSurface();
  } finally {
    unmountDetachedSurface();
  }
}

async function transferMountedTemplate({
  exportPage,
  mountDetachedSurface,
  navigate,
  unmountDetachedSurface,
}) {
  try {
    await mountDetachedSurface();

    if (!exportPage.current) {
      return;
    }

    await transferTemplateToCanvas(exportPage.current);
    navigate("/canvas");
  } catch (error) {
    console.error("Unable to transfer template into the canvas editor.", error);
  } finally {
    unmountDetachedSurface();
  }
}

export function useTemplateEditorActions() {
  const [isTransferring, setIsTransferring] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();
  const fileHandlers = useTemplateFileHandlers();
  const {
    detachedSnapshot,
    exportContentRef,
    exportPageRef,
    isPrinting,
    mountDetachedSurface,
    printDetachedSurface,
    unmountDetachedSurface,
  } = useDetachedTemplateSurface();
  const isBusy = isExporting || isPrinting || isTransferring;

  const handleExportPdf = useCallback(async () => {
    if (isBusy) {
      return;
    }

    setIsExporting(true);

    try {
      await exportTemplatePdf({
        exportContent: exportContentRef,
        exportPage: exportPageRef,
        mountDetachedSurface,
        printDetachedSurface,
        unmountDetachedSurface,
      });
    } finally {
      setIsExporting(false);
    }
  }, [exportContentRef, exportPageRef, isBusy, mountDetachedSurface, printDetachedSurface, unmountDetachedSurface]);

  const handleTransferToCanvas = useCallback(async () => {
    if (isBusy) {
      return;
    }

    setIsTransferring(true);

    try {
      await transferMountedTemplate({
        exportPage: exportPageRef,
        mountDetachedSurface,
        navigate,
        unmountDetachedSurface,
      });
    } finally {
      setIsTransferring(false);
    }
  }, [exportPageRef, isBusy, mountDetachedSurface, navigate, unmountDetachedSurface]);

  const handlePrintResume = useCallback(async () => {
    if (isBusy) {
      return;
    }

    try {
      await mountDetachedSurface();
      await printDetachedSurface();
    } finally {
      unmountDetachedSurface();
    }
  }, [isBusy, mountDetachedSurface, printDetachedSurface, unmountDetachedSurface]);

  return {
    ...fileHandlers,
    detachedSnapshot,
    exportContentRef,
    exportPageRef,
    handleExportPdf,
    handlePrintResume,
    handleTransferToCanvas,
    isExporting,
    isPrinting,
    isTransferring,
  };
}
