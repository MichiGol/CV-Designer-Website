import cx from "clsx";

import {
  DEFAULT_MINI_PREVIEW_ACCENT,
  MINI_PREVIEW_ACCENT_ALPHA,
  MINI_PREVIEW_CSS_VARS,
} from "./LayoutMiniPreview.constants.js";
import styles from "./LayoutMiniPreview.module.scss";

const SHAPED_HEADER_PATHS = {
  arch: "M0,10 Q50,0 100,10 Z",
  diagonal: "M0,8 L100,2 L100,8 Z",
  wave: "M0,8 C25,2 50,8 75,4 C90,1 100,5 100,3 L100,8 Z",
};

function withAlpha(color, alpha) {
  return `${color}${alpha}`;
}

function getPreviewStyleVars(accent = DEFAULT_MINI_PREVIEW_ACCENT) {
  return {
    [MINI_PREVIEW_CSS_VARS.accent]: accent,
    [MINI_PREVIEW_CSS_VARS.accentFaint]: withAlpha(accent, MINI_PREVIEW_ACCENT_ALPHA.faint),
    [MINI_PREVIEW_CSS_VARS.accentMedium]: withAlpha(accent, MINI_PREVIEW_ACCENT_ALPHA.medium),
    [MINI_PREVIEW_CSS_VARS.accentSoft]: withAlpha(accent, MINI_PREVIEW_ACCENT_ALPHA.soft),
    [MINI_PREVIEW_CSS_VARS.accentStrong]: withAlpha(accent, MINI_PREVIEW_ACCENT_ALPHA.strong),
    [MINI_PREVIEW_CSS_VARS.accentSubtle]: withAlpha(accent, MINI_PREVIEW_ACCENT_ALPHA.subtle),
    [MINI_PREVIEW_CSS_VARS.accentTint]: withAlpha(accent, MINI_PREVIEW_ACCENT_ALPHA.tint),
    [MINI_PREVIEW_CSS_VARS.accentWash]: withAlpha(accent, MINI_PREVIEW_ACCENT_ALPHA.wash),
    [MINI_PREVIEW_CSS_VARS.layoutColor]: withAlpha(accent, MINI_PREVIEW_ACCENT_ALPHA.layoutColor),
  };
}

function ModernFlowPreview() {
  return (
    <>
      <div className={styles.modernFlowHeader}>
        <div className={styles.modernFlowAccent} />
      </div>
      <div className={styles.modernFlowBody}>
        <div className={styles.modernFlowSidebar}>
          <div className={styles.modernFlowAvatar} />
          <div className={styles.modernFlowSidebarLine} />
        </div>
        <div className={styles.modernFlowContent}>
          <div className={styles.modernFlowTitle} />
          <div className={styles.modernFlowLineLong} />
          <div className={styles.modernFlowLineFull} />
        </div>
      </div>
    </>
  );
}

function DarkDashboardPreview() {
  return (
    <>
      <div className={styles.darkDashboardHeader} />
      <div className={styles.darkDashboardGrid}>
        <div className={styles.darkDashboardPanel} />
        <div className={styles.darkDashboardStack}>
          <div className={styles.darkDashboardPanel} />
          <div className={styles.darkDashboardPanel} />
        </div>
      </div>
    </>
  );
}

function EditorialPuristPreview() {
  return (
    <>
      <div className={styles.puristHeading} />
      <div className={styles.puristRule} />
      <div className={styles.puristRows}>
        <PuristRow />
        <PuristRow />
      </div>
    </>
  );
}

function PuristRow() {
  return (
    <div className={styles.puristRow}>
      <div className={styles.puristRowLabel} />
      <div className={styles.puristRowText} />
    </div>
  );
}

function TerminalPreview() {
  return (
    <div className={styles.terminalWindow}>
      <div className={styles.terminalTopBar}>
        <div className={styles.terminalDotRed} />
        <div className={styles.terminalDotYellow} />
        <div className={styles.terminalDotGreen} />
      </div>
      <div className={styles.terminalLines}>
        <div className={styles.terminalCommand} />
        <div className={styles.terminalAccentLine} />
        <div className={styles.terminalMutedLine} />
        <div className={styles.terminalCyanLine} />
      </div>
    </div>
  );
}

function SplitTonePreview() {
  return (
    <>
      <div className={styles.splitToneSidebar} />
      <div className={styles.splitToneContent}>
        <div className={styles.splitToneTitle} />
        <div className={styles.splitToneLineLong} />
        <div className={styles.splitToneAccentLine} />
        <div className={styles.splitToneLineFull} />
      </div>
    </>
  );
}

function NotionStylePreview() {
  return (
    <>
      <div className={styles.notionHeader}>
        <div className={styles.notionAvatar} />
      </div>
      <div className={styles.notionBody}>
        <div className={styles.notionIcon} />
        <div className={styles.notionTitle} />
        <div className={styles.notionTags}>
          <div />
          <div />
          <div />
        </div>
        <div className={styles.notionCard} />
      </div>
    </>
  );
}

function SignaturePalettePreview({ accent, bodyBg, headerBg, sidebarBg }) {
  return (
    <div style={{ background: bodyBg, display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <div style={{ background: headerBg, flex: "0 0 17px", position: "relative" }}>
        <div style={{ background: accent, bottom: 0, height: "100%", opacity: 0.8, position: "absolute", right: 0, width: 9 }} />
      </div>
      <div style={{ display: "grid", flex: 1, gridTemplateColumns: "32% 1fr" }}>
        <div style={{ background: sidebarBg, opacity: 0.95 }} />
        <div style={{ display: "grid", gap: 3, padding: "5px 6px" }}>
          <div style={{ background: accent, borderRadius: 2, height: 4, width: "58%" }} />
          <div style={{ background: "rgba(100,116,139,0.35)", borderRadius: 2, height: 3, width: "82%" }} />
          <div style={{ background: "rgba(100,116,139,0.22)", borderRadius: 2, height: 3, width: "74%" }} />
          <div style={{ background: "rgba(100,116,139,0.22)", borderRadius: 2, height: 3, width: "64%" }} />
        </div>
      </div>
    </div>
  );
}

function ShapedHeaderPreview({ shape }) {
  const isArch = shape === "arch";

  return (
    <>
      <div className={styles.shapedHeaderTop}>
        <svg
          className={cx(styles.shapedHeaderSvg, {
            [styles["shapedHeaderSvg--arch"]]: isArch,
          })}
          preserveAspectRatio="none"
          viewBox={isArch ? "0 0 100 10" : "0 0 100 8"}
        >
          <path className={styles.shapedHeaderPath} d={SHAPED_HEADER_PATHS[shape]} />
        </svg>
      </div>
      <div className={styles.shapedHeaderBody}>
        <div className={styles.shapedHeaderMainBlock} />
        <div className={styles.shapedHeaderSideBlock} />
      </div>
    </>
  );
}

function SplitPreview() {
  return (
    <>
      <div className={styles.splitSidebar} />
      <div className={styles.splitContent}>
        <div />
        <div className={styles.splitLineMedium} />
        <div className={styles.splitLineLong} />
      </div>
    </>
  );
}

function ExecutivePreview() {
  return (
    <>
      <div className={styles.executiveAccent} />
      <div className={styles.executiveTitle} />
      <div className={styles.executiveRule} />
      <div className={styles.executiveBody}>
        <div className={styles.executiveSideBlock} />
        <div className={styles.executiveTextStack}>
          <div />
          <div className={styles.executiveTextMedium} />
        </div>
      </div>
    </>
  );
}

function CardPreview() {
  return (
    <>
      <div className={styles.cardHeader} />
      <div className={styles.cardGrid}>
        <div />
        <div />
      </div>
    </>
  );
}

function DarkModePreview() {
  return (
    <>
      <div className={styles.darkModeHeader}>
        <div className={styles.darkModeAvatar} />
        <div className={styles.darkModeTitle} />
      </div>
      <div className={styles.darkModeBody}>
        <div className={styles.darkModeSidebar} />
        <div className={styles.darkModeContent}>
          <div className={styles.darkModeAccentLine} />
          <div className={styles.darkModeMutedLine} />
        </div>
      </div>
    </>
  );
}

function EditorialPreview() {
  return (
    <>
      <div className={styles.editorialMasthead} />
      <div className={styles.editorialRule} />
      <div className={styles.editorialBody}>
        <div />
        <div className={styles.editorialLineLong} />
        <div className={styles.editorialFineRule} />
      </div>
    </>
  );
}

function DefaultPreview() {
  return null;
}

const PREVIEW_COMPONENTS = {
  arch: () => <ShapedHeaderPreview shape="arch" />,
  auroradusk: () => <SignaturePalettePreview accent="#14b8a6" bodyBg="#f5f3ff" headerBg="#7c3aed" sidebarBg="#ede9fe" />,
  bauhausblocks: () => <SignaturePalettePreview accent="#f2c400" bodyBg="#ffffff" headerBg="#111111" sidebarBg="#111111" />,
  card: CardPreview,
  darkdashboard: DarkDashboardPreview,
  darkmode: DarkModePreview,
  diagonal: () => <ShapedHeaderPreview shape="diagonal" />,
  editorial: EditorialPreview,
  editorialpurist: EditorialPuristPreview,
  executive: ExecutivePreview,
  modernflow: ModernFlowPreview,
  noirparisian: () => <SignaturePalettePreview accent="#b89a6a" bodyBg="#faf8f3" headerBg="#0d1f3c" sidebarBg="#0d1f3c" />,
  notionstyle: NotionStylePreview,
  obsidianedge: () => <SignaturePalettePreview accent="#c9a84c" bodyBg="#f9f7f4" headerBg="#0f0f0f" sidebarBg="#0f0f0f" />,
  printguild: () => <SignaturePalettePreview accent="#9b2020" bodyBg="#f2ead8" headerBg="#3a2010" sidebarBg="#e8dfc5" />,
  split: SplitPreview,
  splittone: SplitTonePreview,
  swisssignal: () => <SignaturePalettePreview accent="#e63030" bodyBg="#ffffff" headerBg="#ffffff" sidebarBg="#f7f7f7" />,
  terminal: TerminalPreview,
  wave: () => <ShapedHeaderPreview shape="wave" />,
};

const PREVIEW_SHELL_CLASSNAMES = {
  card: styles["shell--card"],
  darkdashboard: styles["shell--darkDashboard"],
  darkmode: styles["shell--darkMode"],
  editorial: styles["shell--editorial"],
  editorialpurist: styles["shell--editorialPurist"],
  executive: styles["shell--executive"],
  notionstyle: styles["shell--notionStyle"],
  split: styles["shell--row"],
  splittone: styles["shell--row"],
  terminal: styles["shell--terminal"],
};

export function LayoutMiniPreview({ id, accent }) {
  const Preview = PREVIEW_COMPONENTS[id] ?? DefaultPreview;

  return (
    <div
      className={cx(styles.shell, PREVIEW_SHELL_CLASSNAMES[id], {
        [styles["shell--default"]]: !PREVIEW_COMPONENTS[id],
      })}
      style={getPreviewStyleVars(accent)}
    >
      <Preview />
    </div>
  );
}
