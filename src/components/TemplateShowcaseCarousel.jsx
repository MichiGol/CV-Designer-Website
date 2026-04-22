import { alpha } from "@mui/material/styles";
import cx from "clsx";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { TEMPLATE_LAYOUTS } from "../config/layoutConfig.js";
import { LayoutMiniPreview } from "./LayoutMiniPreview.jsx";
import styles from "./TemplateShowcaseCarousel.module.scss";

const accents = ["#3b82f6", "#0ea5e9", "#38bdf8", "#22c55e", "#f97316", "#f59e0b"];
const groupLabels = {
  featured: "Neue Kollektion",
  header: "Kopfbereich",
  column: "Spaltenlayout",
  special: "Speziallayout",
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

function PreviewCard({ accent, current = false, layout, onClick, tone }) {
  const interactive = typeof onClick === "function";

  return (
    <button
      className={cx(styles.previewCard, {
        [styles["previewCard--current"]]: current,
        [styles["previewCard--interactive"]]: interactive,
      })}
      onClick={onClick}
      style={getAccentVars(accent, current)}
      type="button"
    >
      <div className={styles.previewHeader}>
        <span className={styles.previewTone}>{tone}</span>
        <span className={styles.previewGroup}>{groupLabels[layout.group] ?? layout.group}</span>
      </div>

      <div className={styles.previewFrame}>
        <LayoutMiniPreview accent={accent} id={layout.id} />
      </div>

      <div className={styles.previewCopy}>
        <h3 className={styles.previewTitle}>{layout.label}</h3>
        <div className={styles.previewDescription}>{layout.desc}</div>
      </div>
    </button>
  );
}

export default function TemplateShowcaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLayout = TEMPLATE_LAYOUTS[activeIndex];
  const previousIndex = wrapIndex(activeIndex - 1);
  const nextIndex = wrapIndex(activeIndex + 1);
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
          <span className={styles.overline}>Kuratiertes Layout</span>
          <span className={styles.counter}>
            {String(activeIndex + 1).padStart(2, "0")} / {TEMPLATE_LAYOUTS.length}
          </span>
        </div>

        <div aria-live="polite">
          <h2 className={styles.summaryTitle}>{activeLayout.label}</h2>
          <div className={styles.summaryDescription}>
            {activeLayout.desc}. Oeffnen Sie den Vorlagen-Editor direkt mit dieser Vorauswahl und
            wechseln Sie bei Bedarf anschliessend in den Freiform-Editor fuer freie Feinarbeit.
          </div>
        </div>

        <div className={styles.pillRow}>
          <span className={cx(styles.pill, styles["pill--accent"])}>
            {groupLabels[activeLayout.group] ?? activeLayout.group}-Kollektion
          </span>
          <span className={cx(styles.pill, styles["pill--outline"])}>
            {TEMPLATE_LAYOUTS.length} sofort nutzbare Layouts
          </span>
        </div>

        <div className={styles.navActions}>
          <button className={styles.actionButton} onClick={showPrevious} type="button">
            Vorheriges Layout
          </button>
          <button className={styles.actionButton} onClick={showNext} type="button">
            Naechstes Layout
          </button>
        </div>

        <RouterLink className={styles.primaryLink} to={`/templates?layout=${activeLayout.id}`}>
          Dieses Layout bearbeiten
        </RouterLink>

        <div className={styles.nextHint}>
          Als Naechstes: <strong>{TEMPLATE_LAYOUTS[nextIndex].label}</strong>
        </div>
      </div>

      <div className={styles.cardsColumn}>
        <div className={styles.cardsRow}>
          <PreviewCard
            accent={previousAccent}
            layout={TEMPLATE_LAYOUTS[previousIndex]}
            onClick={() => setActiveIndex(previousIndex)}
            tone="Vorher"
          />
          <PreviewCard
            accent={activeAccent}
            current
            layout={activeLayout}
            tone="Ausgewaehlt"
          />
          <PreviewCard
            accent={nextAccent}
            layout={TEMPLATE_LAYOUTS[nextIndex]}
            onClick={() => setActiveIndex(nextIndex)}
            tone="Weiter"
          />
        </div>

        <div className={styles.selectorPanel}>
          {TEMPLATE_LAYOUTS.map((layout, index) => {
            const selected = index === activeIndex;

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
                {layout.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
