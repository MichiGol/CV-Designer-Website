import { memo } from "react";
import cx from "clsx";

import { CANVAS_COPY } from "../../config/canvasCopy.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import styles from "../CanvasEditor.module.scss";

function getStatusItems({ copy, elements, selectedEl, selectedMeta, scale }) {
  return [
    copy.elements(elements.length),
    selectedEl
      ? copy.selected(selectedMeta?.label ?? "Element", Math.round(selectedEl.x), Math.round(selectedEl.y))
      : copy.noSelection,
    `A4 | 794x1123 | ${Math.round(scale * 100)}%`,
    copy.statusHints,
  ];
}

export const CanvasStatusBar = memo(function CanvasStatusBar({
  elements,
  selectedEl,
  selectedMeta,
  scale,
}) {
  const { languageCode } = useLanguage();
  const copy = CANVAS_COPY[languageCode];
  const items = getStatusItems({ copy, elements, selectedEl, selectedMeta, scale });

  return (
    <div className={cx(styles.statusBar, "cv-scroll")}>
      {items.map((text, index) => (
        <span
          key={index}
          className={cx(styles.statusBar__item, {
            [styles["statusBar__item--highlight"]]: index === 1,
          })}
        >
          {index > 0 ? <span className={styles.statusBar__sep}>|</span> : null}
          {text}
        </span>
      ))}
    </div>
  );
});
