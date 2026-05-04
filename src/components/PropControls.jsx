import cx from "clsx";

import styles from "./CanvasEditor.module.scss";

export function SectionLabel({ children }) {
  return <div className={styles.section__label}>{children}</div>;
}

export function FieldLabel({ children }) {
  return <div className={styles.section__fieldLabel}>{children}</div>;
}

export function NumberInput({ value, propKey, min, max, step = 1, onUpdate }) {
  return (
    <input
      className={styles.input}
      type="number"
      min={min}
      max={max}
      step={step}
      value={typeof value === "number" ? (step < 1 ? Math.round(value * 100) / 100 : Math.round(value)) : value}
      onChange={event => onUpdate({ [propKey]: Number(event.target.value) })}
    />
  );
}

function toColorInputValue(color) {
  if (typeof color !== "string") {
    return "#ffffff";
  }

  const trimmed = color.trim();

  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) {
    return trimmed.length === 9 ? trimmed.slice(0, 7) : trimmed;
  }

  const rgbMatch = trimmed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);

  if (!rgbMatch) {
    return "#ffffff";
  }

  return `#${rgbMatch
    .slice(1, 4)
    .map(value => Number(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function ColorInput({ value, propKey, onUpdate }) {
  return (
    <div className={styles.section__colorRow}>
      <input
        className={styles.section__colorSwatch}
        type="color"
        value={!value || value === "transparent" ? "#ffffff" : toColorInputValue(value)}
        onChange={event => onUpdate({ [propKey]: event.target.value })}
      />
      <input
        className={styles.section__colorText}
        type="text"
        value={value || "transparent"}
        onChange={event => onUpdate({ [propKey]: event.target.value })}
      />
    </div>
  );
}

export function PropButton({ onClick, danger = false, children }) {
  return (
    <button
      className={cx(styles.inputBtn, { [styles["inputBtn--danger"]]: danger })}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
