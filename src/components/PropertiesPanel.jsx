import { memo } from "react";
import cx from "clsx";

import { getElementTypeMeta } from "../config/layoutConfig.js";
import { A4_H, A4_W } from "../hooks/useCanvasEditor.js";
import {
  ColorInput,
  FieldLabel,
  NumberInput,
  PropButton,
  SectionLabel,
} from "./PropControls.jsx";

import styles from "./CanvasEditor.module.scss";

const FONT_OPTIONS = [
  ["'DM Sans',sans-serif", "DM Sans"],
  ["'Cormorant Garamond',Georgia,serif", "Cormorant"],
  ["'EB Garamond',Georgia,serif", "EB Garamond"],
  ["'Lato',sans-serif", "Lato"],
  ["'Bebas Neue',sans-serif", "Bebas Neue"],
  ["Georgia,serif", "Georgia"],
  ["'Courier New',monospace", "Courier New"],
];

const FIT_OPTIONS = ["cover", "contain", "fill"];
const Z_ACTIONS = [
  ["Nach vorne", "up"],
  ["Nach hinten", "down"],
  ["Ganz nach vorne", "front"],
  ["Ganz nach hinten", "back"],
];

const SliderField = memo(function SliderField({
  formatValue = value => `${Math.round(value)}`,
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
}) {
  const safeValue = Number.isFinite(value) ? value : min;

  return (
    <div className={styles.section__fieldBlock}>
      <div className={styles.section__fieldLabelRow}>
        <FieldLabel>{label}</FieldLabel>
        <span className={styles.section__sliderValue}>{formatValue(safeValue)}</span>
      </div>
      <input
        className={styles.section__slider}
        max={max}
        min={min}
        onChange={event => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={safeValue}
      />
    </div>
  );
});

const PositionSection = memo(function PositionSection({ el, onUpdate }) {
  return (
    <div className={styles.section}>
      <SectionLabel>Position &amp; Groesse</SectionLabel>

      <div className={styles.section__grid2}>
        <div>
          <FieldLabel>X</FieldLabel>
          <NumberInput value={el.x} propKey="x" min={-A4_W} max={A4_W} onUpdate={onUpdate} />
        </div>
        <div>
          <FieldLabel>Y</FieldLabel>
          <NumberInput value={el.y} propKey="y" min={-A4_H} max={A4_H} onUpdate={onUpdate} />
        </div>
      </div>

      <div className={styles.section__grid2}>
        <div>
          <FieldLabel>Breite</FieldLabel>
          <NumberInput value={el.width} propKey="width" min={10} max={A4_W} onUpdate={onUpdate} />
        </div>
        <div>
          <FieldLabel>Hoehe</FieldLabel>
          <NumberInput value={el.height} propKey="height" min={4} max={A4_H} onUpdate={onUpdate} />
        </div>
      </div>

      <FieldLabel>Deckkraft</FieldLabel>
      <input
        className={styles.section__opacitySlider}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={el.opacity}
        onChange={event => onUpdate({ opacity: Number(event.target.value) })}
      />
    </div>
  );
});

const StyleButtonRow = memo(function StyleButtonRow({ el, onUpdate }) {
  return (
    <div className={styles.fontRow}>
      <button
        className={styles.fontBtn}
        type="button"
        onClick={() => onUpdate({ fontWeight: el.fontWeight === "700" ? "400" : "700" })}
      >
        B
      </button>
      <button
        className={styles.fontBtn}
        type="button"
        onClick={() => onUpdate({ fontStyle: el.fontStyle === "italic" ? "normal" : "italic" })}
      >
        I
      </button>
      <button
        className={styles.fontBtn}
        type="button"
        onClick={() => onUpdate({ textDecoration: el.textDecoration === "underline" ? "none" : "underline" })}
      >
        U
      </button>
      <div className={styles.fontRow__spacer} />
      {["left", "center", "right"].map(align => (
        <button
          key={align}
          className={styles.fontBtn}
          type="button"
          onClick={() => onUpdate({ textAlign: align })}
        >
          {align === "left" ? "L" : align === "center" ? "Z" : "R"}
        </button>
      ))}
    </div>
  );
});

const TypographySection = memo(function TypographySection({ el, onUpdate }) {
  return (
    <div className={styles.section}>
      <SectionLabel>Typografie</SectionLabel>

      <div className={styles.section__fieldBlock}>
        <FieldLabel>Schriftart</FieldLabel>
        <select
          className={styles.input}
          value={el.fontFamily}
          onChange={event => onUpdate({ fontFamily: event.target.value })}
        >
          {FONT_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section__grid2}>
        <div>
          <FieldLabel>Groesse</FieldLabel>
          <NumberInput value={el.fontSize} propKey="fontSize" min={6} max={120} onUpdate={onUpdate} />
        </div>
        <div>
          <FieldLabel>Zeilenabstand</FieldLabel>
          <NumberInput value={el.lineHeight} propKey="lineHeight" min={1} max={3} step={0.05} onUpdate={onUpdate} />
        </div>
      </div>

      <StyleButtonRow el={el} onUpdate={onUpdate} />

      <FieldLabel>Textfarbe</FieldLabel>
      <div className={styles.section__fieldBlock}>
        <ColorInput value={el.color} propKey="color" onUpdate={onUpdate} />
      </div>

      <FieldLabel>Hintergrund</FieldLabel>
      <button
        className={cx(styles.fontBtn, styles.section__fieldBlockSm)}
        type="button"
        onClick={() => onUpdate({ bgColor: "transparent" })}
      >
        Transparent
      </button>
      <ColorInput
        value={el.bgColor === "transparent" ? "#ffffff" : el.bgColor}
        propKey="bgColor"
        onUpdate={onUpdate}
      />
    </div>
  );
});

const AppearanceSection = memo(function AppearanceSection({ el, onUpdate }) {
  const hasStroke = el.type !== "line";
  const hasRadius = el.type === "rect";

  return (
    <div className={styles.section}>
      <SectionLabel>Aussehen</SectionLabel>

      <FieldLabel>Fuellfarbe</FieldLabel>
      <div className={styles.section__fieldBlock}>
        <ColorInput value={el.color} propKey="color" onUpdate={onUpdate} />
      </div>

      {hasStroke ? (
        <>
          <FieldLabel>Rahmenfarbe</FieldLabel>
          <ColorInput value={el.borderColor || "transparent"} propKey="borderColor" onUpdate={onUpdate} />
          <div className={styles.section__topGap}>
            <FieldLabel>Rahmenstaerke</FieldLabel>
            <NumberInput value={el.borderWidth || 0} propKey="borderWidth" min={0} max={20} onUpdate={onUpdate} />
          </div>
        </>
      ) : null}

      {hasRadius ? (
        <div className={styles.section__topGap}>
          <FieldLabel>Eckenradius</FieldLabel>
          <NumberInput value={el.borderRadius || 0} propKey="borderRadius" min={0} max={200} onUpdate={onUpdate} />
        </div>
      ) : null}
    </div>
  );
});

const ImageSection = memo(function ImageSection({ el, onUpdate }) {
  const imageScale = Number.isFinite(el.imageScale) ? el.imageScale : 1;
  const objectPositionX = Number.isFinite(el.objectPositionX) ? el.objectPositionX : 50;
  const objectPositionY = Number.isFinite(el.objectPositionY) ? el.objectPositionY : 50;

  return (
    <div className={styles.section}>
      <SectionLabel>Bild</SectionLabel>

      <FieldLabel>Rahmenfarbe</FieldLabel>
      <div className={styles.section__fieldBlock}>
        <ColorInput value={el.borderColor || "transparent"} propKey="borderColor" onUpdate={onUpdate} />
      </div>

      <div className={styles.section__grid2}>
        <div>
          <FieldLabel>Rahmenstaerke</FieldLabel>
          <NumberInput value={el.borderWidth || 0} propKey="borderWidth" min={0} max={20} onUpdate={onUpdate} />
        </div>
        <div>
          <FieldLabel>Radius</FieldLabel>
          <NumberInput value={el.borderRadius || 0} propKey="borderRadius" min={0} max={200} onUpdate={onUpdate} />
        </div>
      </div>

      <FieldLabel>Anpassung</FieldLabel>
      <select
        className={styles.input}
        value={el.objectFit || "cover"}
        onChange={event => onUpdate({ objectFit: event.target.value })}
      >
        {FIT_OPTIONS.map(option => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>

      <SliderField
        formatValue={value => `${value.toFixed(2)}x`}
        label="Zoom"
        max={3}
        min={1}
        onChange={value => onUpdate({ imageScale: value })}
        step={0.05}
        value={imageScale}
      />

      <SliderField
        formatValue={value => `${Math.round(value)}%`}
        label="Horizontal"
        max={100}
        min={0}
        onChange={value => onUpdate({ objectPositionX: value })}
        value={objectPositionX}
      />

      <SliderField
        formatValue={value => `${Math.round(value)}%`}
        label="Vertikal"
        max={100}
        min={0}
        onChange={value => onUpdate({ objectPositionY: value })}
        value={objectPositionY}
      />

      <div className={styles.section__topGap}>
        <PropButton
          onClick={() =>
            onUpdate({
              imageScale: 1,
              objectPositionX: 50,
              objectPositionY: 50,
            })
          }
        >
          Bildausschnitt zuruecksetzen
        </PropButton>
      </div>
    </div>
  );
});

const LayerOrderSection = memo(function LayerOrderSection({ onZChange, onDuplicate, onDelete }) {
  return (
    <div className={styles.section}>
      <SectionLabel>Ebenenreihenfolge</SectionLabel>

      <div className={cx(styles.section__grid2Sm, styles.section__grid2SmLoose)}>
        {Z_ACTIONS.map(([label, direction]) => (
          <PropButton key={direction} onClick={() => onZChange(direction)}>
            {label}
          </PropButton>
        ))}
      </div>

      <div className={styles.section__grid2Sm}>
        <PropButton onClick={onDuplicate}>Duplizieren</PropButton>
        <PropButton onClick={onDelete} danger>
          Loeschen
        </PropButton>
      </div>
    </div>
  );
});

const EmptyState = memo(function EmptyState({ snapOn, onSnapToggle }) {
  return (
    <>
      <div className={styles.props__header}>
        <div className={styles.props__eyebrow}>Eigenschaften</div>
        <div className={styles.props__title}>Kein Element ausgewaehlt</div>
      </div>

      <div className={styles.section}>
        <SectionLabel>Arbeitsflaeche</SectionLabel>
        <button
          className={cx(
            styles.snapToggle,
            snapOn ? styles["snapToggle--on"] : styles["snapToggle--off"],
          )}
          aria-pressed={snapOn}
          type="button"
          onClick={onSnapToggle}
        >
          {snapOn ? "Raster aktiv" : "Raster inaktiv"}
        </button>
      </div>
    </>
  );
});

export const PropertiesPanel = memo(function PropertiesPanel({
  el,
  onUpdate,
  onDelete,
  onDuplicate,
  onZChange,
  snapOn,
  onSnapToggle,
}) {
  if (!el) {
    return (
      <div className={cx(styles.props, "cv-scroll")}>
        <EmptyState snapOn={snapOn} onSnapToggle={onSnapToggle} />
      </div>
    );
  }

  const meta = getElementTypeMeta(el.type);

  return (
    <div className={cx(styles.props, "cv-scroll")}>
      <div className={styles.props__header}>
        <div className={styles.props__eyebrow}>Eigenschaften</div>
        <div className={styles.props__titleRow}>
          <span className={styles.props__title}>{meta.label}</span>
          <span className={styles.props__badge}>Ebene {el.zIndex}</span>
        </div>
      </div>

      <PositionSection el={el} onUpdate={onUpdate} />

      {el.type === "text" ? <TypographySection el={el} onUpdate={onUpdate} /> : null}
      {["rect", "ellipse", "line"].includes(el.type) ? <AppearanceSection el={el} onUpdate={onUpdate} /> : null}
      {el.type === "image" ? <ImageSection el={el} onUpdate={onUpdate} /> : null}

      <LayerOrderSection
        onZChange={onZChange}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    </div>
  );
});
