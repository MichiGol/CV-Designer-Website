import { useCallback, useRef, useState } from "react";

import {
  buildResumeSnapshot,
  selectEditorSections,
  useTemplateEditorStore,
} from "../../store/templateEditorStore.js";
import {
  ensureTemplateLoaded,
  waitForPaint,
  waitForSurfaceReady,
} from "../../components/templateEditor/templateEditor.utils.js";

async function waitForPrintDialog() {
  await new Promise((resolve, reject) => {
    const handleAfterPrint = () => {
      window.removeEventListener("afterprint", handleAfterPrint);
      resolve();
    };

    window.addEventListener("afterprint", handleAfterPrint);

    try {
      window.print();
    } catch (error) {
      window.removeEventListener("afterprint", handleAfterPrint);
      reject(error);
    }
  });
}

export function useDetachedTemplateSurface() {
  const [detachedSnapshot, setDetachedSnapshot] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const exportPageRef = useRef(null);
  const exportContentRef = useRef(null);

  const mountDetachedSurface = useCallback(async () => {
    const snapshot = buildResumeSnapshot(selectEditorSections(useTemplateEditorStore.getState()));
    await ensureTemplateLoaded(snapshot.settings.layout);
    setDetachedSnapshot(snapshot);
    await waitForPaint();
    return snapshot;
  }, []);

  const unmountDetachedSurface = useCallback(() => {
    setDetachedSnapshot(null);
  }, []);

  const printDetachedSurface = useCallback(async () => {
    if (!exportPageRef.current) {
      return;
    }

    setIsPrinting(true);

    try {
      await waitForSurfaceReady(exportPageRef.current);
      await waitForPrintDialog();
    } finally {
      setIsPrinting(false);
    }
  }, []);

  return {
    detachedSnapshot,
    exportContentRef,
    exportPageRef,
    isPrinting,
    mountDetachedSurface,
    printDetachedSurface,
    unmountDetachedSurface,
  };
}
