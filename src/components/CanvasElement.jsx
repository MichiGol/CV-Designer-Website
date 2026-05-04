import { memo, useEffect, useRef } from "react";
import cx from "clsx";

import { RESIZE_HANDLES } from "../hooks/useCanvasEditor.js";
import styles from "./CanvasEditor.module.scss";

const ROUND_HANDLES = new Set(["n", "s", "e", "w"]);
const HANDLE_SIZE = 8;
const noop = () => {};

function toCssLength(value, fallback = "0px") {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value ?? fallback;
}

function getElementClassName(el, selected, ...classNames) {
  return cx(styles.element, classNames, {
    [styles["element--selected"]]: selected,
    [styles["element--locked"]]: el.locked,
    [styles["element--move"]]: selected && !el.locked,
    [styles["element--pointer"]]: !selected && !el.locked,
  });
}

function getBaseVars(el) {
  return {
    "--element-height": toCssLength(el.height),
    "--element-opacity": el.opacity,
    "--element-width": toCssLength(el.width),
    "--element-x": toCssLength(el.x),
    "--element-y": toCssLength(el.y),
    "--element-z-index": el.zIndex,
  };
}

function getTextVars(el) {
  return {
    ...getBaseVars(el),
    "--element-bg": el.bgColor,
    "--element-color": el.color,
    "--element-edit-bg": el.bgColor === "transparent" ? "rgba(37,99,235,0.06)" : el.bgColor,
    "--element-font-family": el.fontFamily,
    "--element-font-size": toCssLength(el.fontSize),
    "--element-font-style": el.fontStyle,
    "--element-font-weight": el.fontWeight,
    "--element-letter-spacing": toCssLength(el.letterSpacing || "normal", "normal"),
    "--element-line-height": el.lineHeight,
    "--element-text-align": el.textAlign,
    "--element-text-decoration": el.textDecoration,
  };
}

function getShapeVars(el, borderRadius = el.borderRadius || 0) {
  return {
    ...getBaseVars(el),
    "--element-border-color": el.borderColor ?? "transparent",
    "--element-border-radius": toCssLength(borderRadius),
    "--element-border-width": toCssLength(el.borderWidth ?? 0),
    "--element-fill": el.color,
    "--element-shadow": el.boxShadow || "none",
  };
}

function getImageVars(el, positionX, positionY, imageScale) {
  return {
    ...getBaseVars(el),
    "--image-border-color": el.borderColor ?? "transparent",
    "--image-border-radius": toCssLength(el.borderRadius || 0),
    "--image-border-width": toCssLength(el.borderWidth ?? 0),
    "--image-object-fit": el.objectFit || "cover",
    "--image-position-x": `${positionX}%`,
    "--image-position-y": `${positionY}%`,
    "--image-scale": imageScale,
    "--image-shadow": el.boxShadow || "none",
  };
}

function clampImagePosition(value) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 50));
}

function clampImageScale(value) {
  return Math.max(1, Math.min(3, Number.isFinite(value) ? value : 1));
}

export const ResizeHandles = memo(function ResizeHandles({ el, onHandleDown }) {
  return RESIZE_HANDLES.map(handle => (
    <div
      key={handle.id}
      className={cx(
        styles.resizeHandle,
        ROUND_HANDLES.has(handle.id) ? styles["resizeHandle--round"] : styles["resizeHandle--square"],
      )}
      style={{
        "--resize-handle-cursor": handle.cur,
        "--resize-handle-left": `${handle.cx * el.width - HANDLE_SIZE / 2}px`,
        "--resize-handle-top": `${handle.cy * el.height - HANDLE_SIZE / 2}px`,
      }}
      onMouseDown={event => {
        event.stopPropagation();
        onHandleDown(event, handle.id);
      }}
    />
  ));
});

const TextElement = memo(function TextElement({
  el,
  selected,
  editing,
  onBodyDown,
  onDblClick,
  onHandleDown,
  onTextChange,
  onStopEditing,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  return (
    <div
      className={getElementClassName(
        el,
        selected,
        styles["element--text"],
        editing ? styles["element--editing"] : null,
      )}
      style={getTextVars(el)}
      onMouseDown={onBodyDown}
      onDoubleClick={event => {
        event.stopPropagation();

        if (!el.locked) {
          onDblClick();
        }
      }}
    >
      {editing ? (
        <textarea
          ref={textareaRef}
          className={styles.element__textarea}
          defaultValue={el.content}
          onBlur={onStopEditing}
          onChange={event => onTextChange(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Escape") {
              onStopEditing();
            }

            event.stopPropagation();
          }}
        />
      ) : (
        <div className={styles.element__textContent}>
          {el.content}
        </div>
      )}

      {selected && !editing && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null}
    </div>
  );
});

const RectElement = memo(function RectElement({ el, selected, onBodyDown, onHandleDown }) {
  return (
    <div
      className={getElementClassName(el, selected, styles["element--shape"])}
      style={getShapeVars(el)}
      onMouseDown={onBodyDown}
    >
      {selected && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null}
    </div>
  );
});

const EllipseElement = memo(function EllipseElement({ el, selected, onBodyDown, onHandleDown }) {
  return (
    <div
      className={getElementClassName(el, selected, styles["element--shape"], styles["element--ellipse"])}
      style={getShapeVars(el, "50%")}
      onMouseDown={onBodyDown}
    >
      {selected && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null}
    </div>
  );
});

const LineElement = memo(function LineElement({ el, selected, onBodyDown, onHandleDown }) {
  return (
    <div
      className={getElementClassName(el, selected, styles["element--line"])}
      style={getShapeVars(el)}
      onMouseDown={onBodyDown}
    >
      {selected && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null}
    </div>
  );
});

const ImageElement = memo(function ImageElement({ el, selected, onBodyDown, onHandleDown }) {
  const positionX = clampImagePosition(el.objectPositionX);
  const positionY = clampImagePosition(el.objectPositionY);
  const imageScale = clampImageScale(el.imageScale);

  return (
    <div
      className={getElementClassName(el, selected, styles["element--image"])}
      style={getImageVars(el, positionX, positionY, imageScale)}
      onMouseDown={onBodyDown}
    >
      <div className={styles.element__imageFrame}>
        <img
          alt=""
          draggable={false}
          className={styles.element__image}
          src={el.src}
        />
      </div>
      {selected && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null}
    </div>
  );
});

const ELEMENT_RENDERERS = {
  ellipse: EllipseElement,
  image: ImageElement,
  line: LineElement,
  rect: RectElement,
  text: TextElement,
};

export const CanvasElement = memo(function CanvasElement({
  el,
  selected = false,
  editing = false,
  interactive = true,
  onBodyDown,
  onHandleDown,
  onDblClick,
  onTextChange,
  onStopEditing,
}) {
  const safeBodyDown = interactive ? onBodyDown ?? noop : noop;
  const safeHandleDown = interactive ? onHandleDown ?? noop : noop;
  const safeDoubleClick = interactive ? onDblClick ?? noop : noop;
  const safeTextChange = interactive ? onTextChange ?? noop : noop;
  const safeStopEditing = interactive ? onStopEditing ?? noop : noop;

  function handleBodyDown(event) {
    if (event.button !== 0 || editing) {
      return;
    }

    event.stopPropagation();
    safeBodyDown(event, el.id);
  }

  function handleHandleDown(event, handle) {
    safeHandleDown(event, el.id, handle);
  }

  function handleDoubleClick() {
    safeDoubleClick(el.id, el.type);
  }

  function handleTextChange(value) {
    safeTextChange(el.id, value);
  }

  const sharedProps = {
    el,
    selected: interactive && selected,
    onBodyDown: handleBodyDown,
    onHandleDown: handleHandleDown,
  };
  const ElementRenderer = ELEMENT_RENDERERS[el.type];

  if (!ElementRenderer) {
    return null;
  }

  return (
    <ElementRenderer
      {...sharedProps}
      editing={interactive && editing}
      onDblClick={handleDoubleClick}
      onTextChange={handleTextChange}
      onStopEditing={safeStopEditing}
    />
  );
});
