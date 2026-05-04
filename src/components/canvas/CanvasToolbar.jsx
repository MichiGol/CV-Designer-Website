import { memo } from "react";
import cx from "clsx";

import { CANVAS_COPY } from "../../config/canvasCopy.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import styles from "../CanvasEditor.module.scss";

const TOOL_BUTTONS = [
  { type: "text" },
  { type: "rect" },
  { type: "ellipse" },
  { type: "line" },
];

const ToolButton = memo(function ToolButton({ label, onClick }) {
  return (
    <button className={styles.toolbar__btn} type="button" onClick={onClick}>
      {label}
    </button>
  );
});

export const CanvasToolbar = memo(function CanvasToolbar({
  snapOn,
  scale,
  isExporting,
  onAddElement,
  onResetTemplate,
  onToggleSnap,
  onScaleChange,
  onExport,
}) {
  const { languageCode } = useLanguage();
  const copy = CANVAS_COPY[languageCode];

  return (
    <div className={styles.toolbar}>
      {TOOL_BUTTONS.map(tool => (
        <ToolButton
          key={tool.type}
          label={copy.addTools[tool.type]}
          onClick={() => onAddElement(tool.type)}
        />
      ))}

      <div className={styles.toolbar__sep} />

      <button className={cx(styles.input, styles.toolbar__resetBtn)} type="button" onClick={onResetTemplate}>
        {copy.resetTemplate}
      </button>

      <div className={styles.toolbar__sep} />

      <button
        className={cx(
          styles.toolbar__snapBtn,
          snapOn ? styles["toolbar__snapBtn--on"] : styles["toolbar__snapBtn--off"],
        )}
        aria-pressed={snapOn}
        type="button"
        onClick={onToggleSnap}
      >
        {snapOn ? copy.snapActive : copy.snapOff}
      </button>

      <div className={styles.toolbar__spacer} />

      <div className={styles.toolbar__zoom}>
        <span className={styles.toolbar__zoomLabel}>{copy.zoom}</span>
        <input
          type="range"
          min={0.35}
          max={1.2}
          step={0.05}
          value={scale}
          onChange={event => onScaleChange(Number(event.target.value))}
        />
        <span className={styles.toolbar__zoomValue}>{Math.round(scale * 100)}%</span>
      </div>

      <div className={styles.toolbar__gap} />

      <button
        className={cx(styles.toolbar__exportBtn, {
          [styles["toolbar__exportBtn--exporting"]]: isExporting,
        })}
        disabled={isExporting}
        type="button"
        onClick={onExport}
      >
        {isExporting ? copy.exporting : "PDF"}
      </button>
    </div>
  );
});
