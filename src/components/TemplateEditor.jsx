import { useState } from "react";
import cx from "clsx";

import { useTemplateEditorActions } from "../hooks/useTemplateEditorActions.js";
import { useTemplateEditorStore } from "../store/templateEditorStore.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { EDITOR_TABS, TEMPLATE_EDITOR_COPY } from "./templateEditor/templateEditor.constants.js";
import { TemplateEditorPanel } from "./templateEditor/TemplateEditorPanels.jsx";
import {
  DetachedRenderSurface,
  ResumePreviewPane,
} from "./templateEditor/TemplateEditorPreview.jsx";
import { getAccentCssVariables } from "./templateEditor/templateEditor.utils.js";

import styles from "./templateEditor/TemplateEditor.module.scss";

export function TemplateEditor() {
  const [tab, setTab] = useState("personal");
  const { languageCode } = useLanguage();
  const copy = TEMPLATE_EDITOR_COPY[languageCode];
  const accent = useTemplateEditorStore(state => state.settings.accent);
  const {
    detachedSnapshot,
    exportContentRef,
    exportPageRef,
    handleExportPdf,
    handleJSONImport,
    handleOpenJsonImport,
    handlePhotoUpload,
    handlePrintResume,
    handleTransferToCanvas,
    isExporting,
    isPrinting,
    isTransferring,
    jsonRef,
    photoRef,
  } = useTemplateEditorActions();

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
                {tabOption.label[languageCode]}
              </button>
            );
          })}
        </div>

        <div className={cx(styles.formBody, "cv-form-body", "cv-scroll")}>
          <TemplateEditorPanel
            copy={copy}
            languageCode={languageCode}
            onPhotoUpload={handlePhotoUpload}
            photoRef={photoRef}
            tab={tab}
          />
        </div>

        <div className={styles.footer}>
          <div className={styles.actionGrid}>
            <button
              className={styles.actionButton}
              onClick={handleOpenJsonImport}
              type="button"
            >
              {copy.import}
            </button>

            <button
              className={styles.actionButton}
              disabled={isExporting}
              onClick={handleExportPdf}
              type="button"
            >
              {isExporting ? copy.exporting : copy.export}
            </button>

            <button
              className={cx(styles.actionButton, styles["actionButton--primary"])}
              disabled={isTransferring}
              onClick={handleTransferToCanvas}
              type="button"
            >
              {isTransferring ? copy.transfering : copy.canvasTransfer}
            </button>

            <button className={styles.actionButton} onClick={handlePrintResume} type="button">
              {copy.print}
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
