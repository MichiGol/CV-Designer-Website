import { memo } from "react";
import cx from "clsx";

import { getElementTypeMeta } from "../config/layoutConfig.js";
import styles from "./CanvasEditor.module.scss";

const LayerItem = memo(function LayerItem({ el, active, name, onSelect }) {
  const meta = getElementTypeMeta(el.type);

  return (
    <div
      className={cx(styles.layerItem, { [styles["layerItem--active"]]: active })}
      onClick={() => onSelect(el.id)}
    >
      <span className={styles.layerItem__icon}>{meta.icon}</span>
      <span className={styles.layerItem__name}>{name ?? meta.label}</span>
      <span className={styles.layerItem__z}>{el.zIndex}</span>
      {el.locked ? <span className={styles.layerItem__lock}>Lock</span> : null}
    </div>
  );
});

export const LayersPanel = memo(function LayersPanel({
  elements,
  selectedId,
  layerNames,
  onSelect,
}) {
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className={styles.layers}>
      <div className={styles.layers__header}>
        <span className={styles.layers__title}>Ebenen</span>
      </div>
      <div className={cx(styles.layers__list, "cv-scroll")}>
        {sortedElements.map(el => (
          <LayerItem
            key={el.id}
            el={el}
            active={el.id === selectedId}
            name={layerNames.get(el.id)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
});

function ContextBarButton({ icon, onClick, title, danger = false }) {
  return (
    <button
      className={cx(styles.contextBar__btn, {
        [styles["contextBar__btn--danger"]]: danger,
      })}
      type="button"
      title={title}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

const ContextBarSeparator = () => <div className={styles.contextBar__sep} />;

export const FloatingContextBar = memo(function FloatingContextBar({
  el,
  scale,
  onDelete,
  onDuplicate,
  onZChange,
  onLock,
}) {
  const top = Math.max(0, el.y * scale - 40);
  const left = el.x * scale;

  return (
    <div className={styles.contextBar} style={{ top, left }}>
      <div className={styles.contextBar__inner}>
        <ContextBarButton icon="Up" onClick={() => onZChange("up")} title="Ebene vorwaerts" />
        <ContextBarButton icon="Dn" onClick={() => onZChange("down")} title="Ebene rueckwaerts" />
        <ContextBarButton icon="Top" onClick={() => onZChange("front")} title="Ganz nach vorne" />
        <ContextBarButton icon="Bot" onClick={() => onZChange("back")} title="Ganz nach hinten" />
        <ContextBarSeparator />
        <ContextBarButton icon="Dup" onClick={onDuplicate} title="Duplizieren (Strg+D)" />
        <ContextBarButton
          icon={el.locked ? "Open" : "Lock"}
          onClick={onLock}
          title={el.locked ? "Entsperren" : "Sperren"}
        />
        <ContextBarSeparator />
        <ContextBarButton icon="Del" onClick={onDelete} title="Loeschen (Entf)" danger />
      </div>
    </div>
  );
});
