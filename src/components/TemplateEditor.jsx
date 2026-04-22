import { useRef, useState } from "react";
import cx from "clsx";
import { useNavigate } from "react-router-dom";

import {
  buildResumeSnapshot,
  selectEditorSections,
  useTemplateEditorStore,
} from "../store/templateEditorStore.js";
import { transferTemplateToCanvas } from "../utils/templateToCanvas.js";
import { EDITOR_TABS } from "./templateEditor/templateEditor.constants.js";
import { TemplateEditorPanel } from "./templateEditor/TemplateEditorPanels.jsx";
import {
  DetachedRenderSurface,
  ResumePreviewPane,
} from "./templateEditor/TemplateEditorPreview.jsx";
import {
  ensureTemplateLoaded,
  exportPreviewSurfaceAsPdf,
  getAccentCssVariables,
  getResumeFileName,
  waitForPaint,
  waitForSurfaceReady,
} from "./templateEditor/templateEditor.utils.js";

import styles from "./templateEditor/TemplateEditor.module.scss";

export function TemplateEditor() {
  const [tab, setTab] = useState("personal");
  const [isTransferring, setIsTransferring] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [detachedSnapshot, setDetachedSnapshot] = useState(null);
  const navigate = useNavigate();
  const accent = useTemplateEditorStore(state => state.settings.accent);
  const importResumeJson = useTemplateEditorStore(state => state.importResumeJson);

  const photoRef = useRef(null);
  const jsonRef = useRef(null);
  const exportPageRef = useRef(null);
  const exportContentRef = useRef(null);
  const isBusy = isExporting || isPrinting || isTransferring;

  // Build a frozen snapshot before export or transfer so the live preview can keep updating
  // independently while the detached render surface stays deterministic.
  const mountDetachedSurface = async () => {
    const snapshot = buildResumeSnapshot(selectEditorSections(useTemplateEditorStore.getState()));
    await ensureTemplateLoaded(snapshot.settings.layout);
    setDetachedSnapshot(snapshot);
    await waitForPaint();
    return snapshot;
  };

  const unmountDetachedSurface = () => {
    setDetachedSnapshot(null);
  };

  const printDetachedSurface = async () => {
    if (!exportPageRef.current) {
      return;
    }

    setIsPrinting(true);

    try {
      await waitForSurfaceReady(exportPageRef.current);

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
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePhotoUpload = event => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => {
      const result = loadEvent.target?.result ?? null;
      const { updatePersonal } = useTemplateEditorStore.getState();

      updatePersonal("photo", result);
      updatePersonal("photoScale", 1);
      updatePersonal("photoPositionX", 50);
      updatePersonal("photoPositionY", 50);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleJSONImport = event => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => {
      try {
        importResumeJson(JSON.parse(loadEvent.target?.result ?? "{}"));
      } catch (error) {
        console.warn("Unable to import resume JSON.", error);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleExportPdf = async () => {
    if (isBusy) {
      return;
    }

    setIsExporting(true);

    try {
      const snapshot = await mountDetachedSurface();

      if (!exportPageRef.current || !exportContentRef.current) {
        return;
      }

      try {
        await exportPreviewSurfaceAsPdf({
          exportContent: exportContentRef.current,
          exportPage: exportPageRef.current,
          fileName: getResumeFileName(snapshot),
        });
      } catch (error) {
        console.error("PDF export failed. Falling back to browser print.", error);
        await printDetachedSurface();
      }
    } finally {
      unmountDetachedSurface();
      setIsExporting(false);
    }
  };

  const handleTransferToCanvas = async () => {
    if (isBusy) {
      return;
    }

    setIsTransferring(true);

    try {
      await mountDetachedSurface();

      if (!exportPageRef.current) {
        return;
      }

      await transferTemplateToCanvas(exportPageRef.current);
      navigate("/canvas");
    } catch (error) {
      console.error("Unable to transfer template into the canvas editor.", error);
    } finally {
      unmountDetachedSurface();
      setIsTransferring(false);
    }
  };

  const handlePrintResume = async () => {
    if (isBusy) {
      return;
    }

    try {
      await mountDetachedSurface();
      await printDetachedSurface();
    } finally {
      unmountDetachedSurface();
    }
  };

  return (
    <div
      className={cx(styles.editor, "cv-builder", {
        [styles["editor--printing"]]: isPrinting,
      })}
      style={getAccentCssVariables(accent)}
    >
      <aside className={cx(styles.sidebar, "cv-editor-panel")}>
        <div className={cx(styles.tabStrip, "cv-scroll")} role="tablist" aria-label="Editor sections">
          {EDITOR_TABS.map(tabOption => {
            const isActive = tabOption.id === tab;

            return (
              <button
                key={tabOption.id}
                aria-selected={isActive}
                className={cx(styles.tabButton, {
                  [styles["tabButton--active"]]: isActive,
                  [styles["tabButton--accent"]]: isActive && tabOption.id === "design",
                })}
                onClick={() => setTab(tabOption.id)}
                role="tab"
                type="button"
              >
                {tabOption.label}
              </button>
            );
          })}
        </div>

        <div className={cx(styles.formBody, "cv-form-body", "cv-scroll")}>
          <TemplateEditorPanel
            onPhotoUpload={handlePhotoUpload}
            photoRef={photoRef}
            tab={tab}
          />
        </div>

        <div className={styles.footer}>
          <div className={styles.actionGrid}>
            <button
              className={styles.actionButton}
              onClick={() => jsonRef.current?.click()}
              type="button"
            >
              Import
            </button>

            <button
              className={styles.actionButton}
              disabled={isExporting}
              onClick={handleExportPdf}
              type="button"
            >
              {isExporting ? "Export..." : "Export"}
            </button>

            <button
              className={cx(styles.actionButton, styles["actionButton--primary"])}
              disabled={isTransferring}
              onClick={handleTransferToCanvas}
              type="button"
            >
              {isTransferring ? "Transfer..." : "In Freiform oeffnen"}
            </button>

            <button className={styles.actionButton} onClick={handlePrintResume} type="button">
              PDF / Drucken
            </button>
          </div>

          <input
            accept=".json"
            className={styles.visuallyHidden}
            onChange={handleJSONImport}
            ref={jsonRef}
            type="file"
          />
        </div>
      </aside>

      <ResumePreviewPane />
      <DetachedRenderSurface
        exportContentRef={exportContentRef}
        exportPageRef={exportPageRef}
        snapshot={detachedSnapshot}
      />
    </div>
  );
}
