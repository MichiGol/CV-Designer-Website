import { Suspense, lazy, memo, useMemo } from "react";
import cx from "clsx";
import { useShallow } from "zustand/react/shallow";

import { FONT_PAIRS, HEADER_LAYOUT_IDS } from "../../config/layoutConfig.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useDebouncedPreviewSync } from "../../hooks/useDebouncedPreviewSync.js";
import {
  buildResumeSnapshot,
  selectEditorSections,
  useTemplateEditorStore,
} from "../../store/templateEditorStore.js";
import { buildTemplateData } from "../templates/shared.jsx";
import { TEMPLATE_IMPORTERS } from "./templateEditor.constants.js";
import { TEMPLATE_EDITOR_COPY } from "./templateEditor.constants.js";
import { getAccentCssVariables, getPageBackground } from "./templateEditor.utils.js";

import styles from "./TemplateEditor.module.scss";

const lazyNamedTemplate = (templateKey, exportName) =>
  lazy(() => TEMPLATE_IMPORTERS[templateKey]().then(module => ({ default: module[exportName] })));

const CardCV = lazyNamedTemplate("card", "CardCV");
const AuroraDuskCV = lazyNamedTemplate("auroradusk", "AuroraDuskCV");
const BauhausBlocksCV = lazyNamedTemplate("bauhausblocks", "BauhausBlocksCV");
const DarkDashboardCV = lazyNamedTemplate("darkdashboard", "DarkDashboardCV");
const DarkModeCV = lazyNamedTemplate("darkmode", "DarkModeCV");
const EditorialCV = lazyNamedTemplate("editorial", "EditorialCV");
const EditorialPuristCV = lazyNamedTemplate("editorialpurist", "EditorialPuristCV");
const ExecutiveCV = lazyNamedTemplate("executive", "ExecutiveCV");
const HeaderCV = lazyNamedTemplate("header", "HeaderCV");
const ModernFlowCV = lazyNamedTemplate("modernflow", "ModernFlowCV");
const NoirParisianCV = lazyNamedTemplate("noirparisian", "NoirParisianCV");
const NotionStyleCV = lazyNamedTemplate("notionstyle", "NotionStyleCV");
const ObsidianEdgeCV = lazyNamedTemplate("obsidianedge", "ObsidianEdgeCV");
const PrintGuildCV = lazyNamedTemplate("printguild", "PrintGuildCV");
const SplitCV = lazyNamedTemplate("split", "SplitCV");
const SplitToneCV = lazyNamedTemplate("splittone", "SplitToneCV");
const SwissSignalCV = lazyNamedTemplate("swisssignal", "SwissSignalCV");
const TerminalCV = lazyNamedTemplate("terminal", "TerminalCV");

const DATA_TEMPLATE_COMPONENTS = {
  auroradusk: AuroraDuskCV,
  bauhausblocks: BauhausBlocksCV,
  darkdashboard: DarkDashboardCV,
  editorialpurist: EditorialPuristCV,
  modernflow: ModernFlowCV,
  noirparisian: NoirParisianCV,
  notionstyle: NotionStyleCV,
  obsidianedge: ObsidianEdgeCV,
  printguild: PrintGuildCV,
  splittone: SplitToneCV,
  swisssignal: SwissSignalCV,
  terminal: TerminalCV,
};

const CLASSIC_TEMPLATE_COMPONENTS = {
  card: CardCV,
  darkmode: DarkModeCV,
  editorial: EditorialCV,
  executive: ExecutiveCV,
  split: SplitCV,
};

function TemplateSurfaceFallback() {
  const { languageCode } = useLanguage();
  return <div className={styles.templateFallback}>{TEMPLATE_EDITOR_COPY[languageCode].loading.template}</div>;
}

const ResumeTemplateDocument = memo(function ResumeTemplateDocument({
  pageMode = "preview",
  snapshot,
}) {
  const { languageCode } = useLanguage();
  const { cv, settings } = snapshot;
  const displayFont = FONT_PAIRS[settings.fontIdx] ?? FONT_PAIRS[0];
  const DataTemplate = DATA_TEMPLATE_COMPONENTS[settings.layout];
  const ClassicTemplate = CLASSIC_TEMPLATE_COMPONENTS[settings.layout];
  const templateData = useMemo(
    () => (DataTemplate ? buildTemplateData(cv, languageCode) : null),
    [DataTemplate, cv, languageCode],
  );

  if (DataTemplate) {
    return (
      <Suspense fallback={<TemplateSurfaceFallback />}>
        <DataTemplate
          accent={settings.accent}
          bodyFont={displayFont.body}
          bodyBg={settings.bodyBg}
          data={templateData}
          displayFont={displayFont.display}
          headerBg={settings.headerBg}
          pageMode={pageMode}
          sidebarSide={settings.sidebarSide}
          size={settings.size}
          skillDisplay={settings.skillDisplay}
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<TemplateSurfaceFallback />}>
      <>
        {HEADER_LAYOUT_IDS.has(settings.layout) ? (
          <HeaderCV
            bodyFont={displayFont.body}
            cv={cv}
            displayFont={displayFont.display}
            pageMode={pageMode}
            st={settings}
          />
        ) : null}

        {ClassicTemplate ? (
          <ClassicTemplate
            bodyFont={displayFont.body}
            cv={cv}
            displayFont={displayFont.display}
            pageMode={pageMode}
            st={settings}
          />
        ) : null}
      </>
    </Suspense>
  );
});

export const ResumePreviewPane = memo(function ResumePreviewPane() {
  const { languageCode } = useLanguage();
  const copy = TEMPLATE_EDITOR_COPY[languageCode];
  const liveSections = useTemplateEditorStore(useShallow(selectEditorSections));
  const liveSnapshot = useMemo(() => buildResumeSnapshot(liveSections), [liveSections]);
  const { isPreviewPending, previewValue } = useDebouncedPreviewSync(liveSnapshot, 300);
  const pageBackground = getPageBackground(previewValue.settings.layout, previewValue.settings.bodyBg);

  return (
    <section
      className={cx(styles.preview, "cv-preview-panel", "cv-scroll")}
      style={getAccentCssVariables(previewValue.settings.accent)}
    >
      <div
        className={cx(styles.previewStatus, {
          [styles["previewStatus--pending"]]: isPreviewPending,
        })}
      >
        {isPreviewPending ? copy.previewSyncing : copy.previewReady}
      </div>

      <div
        className={cx(styles.previewSheet, "cv-preview-sheet", {
          [styles["previewSheet--dark"]]: pageBackground === "#020617",
        })}
        style={{ background: pageBackground }}
      >
        <ResumeTemplateDocument pageMode="preview" snapshot={previewValue} />
      </div>
    </section>
  );
});

export const DetachedRenderSurface = memo(function DetachedRenderSurface({
  exportContentRef,
  exportPageRef,
  snapshot,
}) {
  if (!snapshot) {
    return null;
  }

  return (
    <div aria-hidden="true" className={styles.detachedSurface}>
      <div
        ref={exportPageRef}
        className={styles.exportPage}
        style={{ background: getPageBackground(snapshot.settings.layout, snapshot.settings.bodyBg) }}
      >
        <div ref={exportContentRef} className={styles.exportContent}>
          <ResumeTemplateDocument pageMode="export" snapshot={snapshot} />
        </div>
      </div>
    </div>
  );
});
