import { memo } from "react";
import cx from "clsx";

import { CANVAS_COPY } from "../config/canvasCopy.js";
import { getElementTypeMeta } from "../config/layoutConfig.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./CanvasEditor.module.scss";

const LayerItem = memo(function LayerItem({ copy, el, active, languageCode, name, onSelect }) {
  const meta = getElementTypeMeta(el.type, languageCode);

  return (
    <div
      className={cx(styles.layerItem, { [styles["layerItem--active"]]: active })}
      onClick={() => onSelect(el.id)}
    >
      <span className={styles.layerItem__icon}>{meta.icon}</span>
      <span className={styles.layerItem__name}>{name ?? meta.label}</span>
      <span className={styles.layerItem__z}>{el.zIndex}</span>
      {el.locked ? <span className={styles.layerItem__lock}>{copy.lockedBadge}</span> : null}
    </div>
  );
});

export const LayersPanel = memo(function LayersPanel({
  elements,
  selectedId,
  layerNames,
  onSelect,
}) {
  const { languageCode } = useLanguage();
  const copy = CANVAS_COPY[languageCode];
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className={styles.layers}>
      <div className={styles.layers__header}>
        <span className={styles.layers__title}>{copy.layers}</span>
      </div>
      <div className={cx(styles.layers__list, "cv-scroll")}>
        {sortedElements.map(el => (
          <LayerItem
            key={el.id}
            copy={copy}
            el={el}
            active={el.id === selectedId}
            languageCode={languageCode}
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
  const { languageCode } = useLanguage();
  const copy = CANVAS_COPY[languageCode];
  const top = Math.max(0, el.y * scale - 40);
  const left = el.x * scale;
  const positionVars = {
    "--context-bar-left": `${left}px`,
    "--context-bar-top": `${top}px`,
  };

  return (
    <div className={styles.contextBar} style={positionVars}>
      <div className={styles.contextBar__inner}>
        <ContextBarButton icon="Up" onClick={() => onZChange("up")} title={copy.layerForwardHint} />
        <ContextBarButton icon="Dn" onClick={() => onZChange("down")} title={copy.layerBackwardHint} />
        <ContextBarButton icon={copy.layerFrontShort} onClick={() => onZChange("front")} title={copy.layerFront} />
        <ContextBarButton icon={copy.layerBackShort} onClick={() => onZChange("back")} title={copy.layerBack} />
        <ContextBarSeparator />
        <ContextBarButton icon="Dup" onClick={onDuplicate} title={copy.duplicateHint} />
        <ContextBarButton
          icon={el.locked ? "Open" : "Lock"}
          onClick={onLock}
          title={el.locked ? copy.unlocked : copy.locked}
        />
        <ContextBarSeparator />
        <ContextBarButton icon="Del" onClick={onDelete} title={copy.deleteHint} danger />
      </div>
    </div>
  );
});
