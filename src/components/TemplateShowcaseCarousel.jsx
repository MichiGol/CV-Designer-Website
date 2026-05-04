import { alpha } from "@mui/material/styles";
import cx from "clsx";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { getLocalizedLayout, TEMPLATE_LAYOUTS } from "../config/layoutConfig.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { LayoutMiniPreview } from "./LayoutMiniPreview.jsx";
import styles from "./TemplateShowcaseCarousel.module.scss";

const accents = ["#3b82f6", "#0ea5e9", "#38bdf8", "#22c55e", "#f97316", "#f59e0b"];
const carouselCopy = {
  DE: {
    collectionSuffix: "Kollektion",
    editLayout: "Dieses Layout bearbeiten",
    groupLabels: {
      column: "Spaltenlayout",
      featured: "Neue Kollektion",
      header: "Kopfbereich",
      special: "Speziallayout",
    },
    layoutCount: count => `${count} sofort nutzbare Layouts`,
    next: "Weiter",
    nextHint: "Als Naechstes:",
    nextLayout: "Naechstes Layout",
    overline: "Kuratiertes Layout",
    previous: "Vorher",
    previousLayout: "Vorheriges Layout",
    selected: "Ausgewaehlt",
    summary: "Oeffnen Sie den Vorlagen-Editor direkt mit dieser Vorauswahl und wechseln Sie bei Bedarf anschliessend in den Freiform-Editor fuer freie Feinarbeit.",
  },
  EN: {
    collectionSuffix: "collection",
    editLayout: "Edit this layout",
    groupLabels: {
      column: "Column layout",
      featured: "New collection",
      header: "Header area",
      special: "Special layout",
    },
    layoutCount: count => `${count} ready-to-use layouts`,
    next: "Next",
    nextHint: "Up next:",
    nextLayout: "Next layout",
    overline: "Curated layout",
    previous: "Previous",
    previousLayout: "Previous layout",
    selected: "Selected",
    summary: "Open the template editor directly with this selection, then move into the freeform editor when you need precise custom work.",
  },
};

function wrapIndex(index) {
  return (index + TEMPLATE_LAYOUTS.length) % TEMPLATE_LAYOUTS.length;
}

function getAccentVars(accent, current = false) {
  return {
    "--carousel-accent-soft": alpha(accent, current ? 0.18 : 0.14),
    "--carousel-accent-border": alpha(accent, current ? 0.32 : 0.16),
    "--carousel-accent-border-hover": alpha(accent, 0.3),
    "--carousel-accent-shadow": alpha(accent, 0.14),
    "--carousel-accent-surface": alpha(accent, current ? 0.18 : 0.1),
  };
}

function PreviewCard({ accent, copy, current = false, index = 0, languageCode, layout, onClick, tone }) {
  const interactive = typeof onClick === "function";
  const localizedLayout = getLocalizedLayout(layout, languageCode);

  return (
    <button
      className={cx(styles.previewCard, {
        [styles["previewCard--current"]]: current,
        [styles["previewCard--interactive"]]: interactive,
      })}
      onClick={onClick}
      style={{
        ...getAccentVars(accent, current),
        "--template-card-index": index,
      }}
      type="button"
    >
      <div className={styles.previewHeader}>
        <span className={styles.previewTone}>{tone}</span>
        <span className={styles.previewGroup}>{copy.groupLabels[layout.group] ?? layout.group}</span>
      </div>

      <div className={styles.previewFrame}>
        <LayoutMiniPreview accent={accent} id={layout.id} />
      </div>

      <div className={styles.previewCopy}>
        <h3 className={styles.previewTitle}>{localizedLayout.label}</h3>
        <div className={styles.previewDescription}>{localizedLayout.desc}</div>
      </div>
    </button>
  );
}

export default function TemplateShowcaseCarousel() {
  const { languageCode } = useLanguage();
  const copy = carouselCopy[languageCode];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLayout = TEMPLATE_LAYOUTS[activeIndex];
  const localizedActiveLayout = getLocalizedLayout(activeLayout, languageCode);
  const previousIndex = wrapIndex(activeIndex - 1);
  const nextIndex = wrapIndex(activeIndex + 1);
  const localizedNextLayout = getLocalizedLayout(TEMPLATE_LAYOUTS[nextIndex], languageCode);
  const activeAccent = accents[activeIndex % accents.length];
  const previousAccent = accents[previousIndex % accents.length];
  const nextAccent = accents[nextIndex % accents.length];

  const showPrevious = () => {
    setActiveIndex(current => wrapIndex(current - 1));
  };

  const showNext = () => {
    setActiveIndex(current => wrapIndex(current + 1));
  };

  return (
    <section className={styles.carousel}>
      <div className={styles.summaryPanel} style={getAccentVars(activeAccent, true)}>
        <div className={styles.summaryHeader}>
          <span className={styles.overline}>{copy.overline}</span>
          <span className={styles.counter}>
            {String(activeIndex + 1).padStart(2, "0")} / {TEMPLATE_LAYOUTS.length}
          </span>
        </div>

        <div aria-live="polite">
          <h2 className={styles.summaryTitle}>{localizedActiveLayout.label}</h2>
          <div className={styles.summaryDescription}>
            {localizedActiveLayout.desc}. {copy.summary}
          </div>
        </div>

        <div className={styles.pillRow}>
          <span className={cx(styles.pill, styles["pill--accent"])}>
            {copy.groupLabels[activeLayout.group] ?? activeLayout.group} {copy.collectionSuffix}
          </span>
          <span className={cx(styles.pill, styles["pill--outline"])}>
            {copy.layoutCount(TEMPLATE_LAYOUTS.length)}
          </span>
        </div>

        <div className={styles.navActions}>
          <button className={styles.actionButton} onClick={showPrevious} type="button">
            {copy.previousLayout}
          </button>
          <button className={styles.actionButton} onClick={showNext} type="button">
            {copy.nextLayout}
          </button>
        </div>

        <RouterLink className={styles.primaryLink} to={`/templates?layout=${activeLayout.id}`}>
          {copy.editLayout}
        </RouterLink>

        <div className={styles.nextHint}>
          {copy.nextHint} <strong>{localizedNextLayout.label}</strong>
        </div>
      </div>

      <div className={styles.cardsColumn}>
        <div className={styles.cardsRow}>
          <PreviewCard
            accent={previousAccent}
            copy={copy}
            index={0}
            key={`previous-${TEMPLATE_LAYOUTS[previousIndex].id}`}
            languageCode={languageCode}
            layout={TEMPLATE_LAYOUTS[previousIndex]}
            onClick={() => setActiveIndex(previousIndex)}
            tone={copy.previous}
          />
          <PreviewCard
            accent={activeAccent}
            copy={copy}
            current
            index={1}
            key={`current-${activeLayout.id}`}
            languageCode={languageCode}
            layout={activeLayout}
            tone={copy.selected}
          />
          <PreviewCard
            accent={nextAccent}
            copy={copy}
            index={2}
            key={`next-${TEMPLATE_LAYOUTS[nextIndex].id}`}
            languageCode={languageCode}
            layout={TEMPLATE_LAYOUTS[nextIndex]}
            onClick={() => setActiveIndex(nextIndex)}
            tone={copy.next}
          />
        </div>

        <div className={styles.selectorPanel}>
          {TEMPLATE_LAYOUTS.map((layout, index) => {
            const selected = index === activeIndex;
            const localizedLayout = getLocalizedLayout(layout, languageCode);

            return (
              <button
                key={layout.id}
                className={cx(styles.selectorButton, {
                  [styles["selectorButton--selected"]]: selected,
                })}
                onClick={() => setActiveIndex(index)}
                style={getAccentVars(accents[index % accents.length], selected)}
                type="button"
              >
                {localizedLayout.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
