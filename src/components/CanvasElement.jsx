import { memo, useEffect, useRef } from "react";
import cx from "clsx";

import { RESIZE_HANDLES } from "../hooks/useCanvasEditor.js";
import styles from "./CanvasEditor.module.scss";

const ROUND_HANDLES = new Set(["n", "s", "e", "w"]);
const HANDLE_SIZE = 8;
const noop = () => {};

function getElementClassName(el, selected) {
  return cx(styles.element, {
    [styles["element--selected"]]: selected,
    [styles["element--locked"]]: el.locked,
    [styles["element--move"]]: selected && !el.locked,
    [styles["element--pointer"]]: !selected && !el.locked,
  });
}

function getBaseStyle(el) {
  return {
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    zIndex: el.zIndex,
    opacity: el.opacity,
  };
}

function getTextStyle(el) {
  return {
    fontSize: el.fontSize,
    fontWeight: el.fontWeight,
    fontStyle: el.fontStyle,
    textDecoration: el.textDecoration,
    fontFamily: el.fontFamily,
    color: el.color,
    textAlign: el.textAlign,
    lineHeight: el.lineHeight,
    letterSpacing: el.letterSpacing || "normal",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
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
        left: handle.cx * el.width - HANDLE_SIZE / 2,
        top: handle.cy * el.height - HANDLE_SIZE / 2,
        cursor: handle.cur,
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
      className={getElementClassName(el, selected)}
      style={{
        ...getBaseStyle(el),
        background: el.bgColor,
        overflow: "visible",
        cursor: editing ? "text" : undefined,
      }}
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
          style={{
            ...getTextStyle(el),
            background: el.bgColor === "transparent" ? "rgba(37,99,235,0.06)" : el.bgColor,
          }}
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
        <div className={styles.element__textContent} style={getTextStyle(el)}>
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
      className={getElementClassName(el, selected)}
      style={{
        ...getBaseStyle(el),
        background: el.color,
        borderRadius: el.borderRadius,
        border: el.borderWidth > 0 ? `${el.borderWidth}px solid ${el.borderColor}` : "none",
        boxShadow: el.boxShadow || "none",
      }}
      onMouseDown={onBodyDown}
    >
      {selected && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null}
    </div>
  );
});

const EllipseElement = memo(function EllipseElement({ el, selected, onBodyDown, onHandleDown }) {
  return (
    <div
      className={getElementClassName(el, selected)}
      style={{
        ...getBaseStyle(el),
        background: el.color,
        borderRadius: "50%",
        border: el.borderWidth > 0 ? `${el.borderWidth}px solid ${el.borderColor}` : "none",
        boxShadow: el.boxShadow || "none",
      }}
      onMouseDown={onBodyDown}
    >
      {selected && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null}
    </div>
  );
});

const LineElement = memo(function LineElement({ el, selected, onBodyDown, onHandleDown }) {
  return (
    <div
      className={getElementClassName(el, selected)}
      style={{
        ...getBaseStyle(el),
        background: el.color,
        boxShadow: el.boxShadow || "none",
      }}
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
      className={getElementClassName(el, selected)}
      style={{ ...getBaseStyle(el), overflow: "visible" }}
      onMouseDown={onBodyDown}
    >
      <div
        className={styles.element__imageFrame}
        style={{
          borderRadius: el.borderRadius || 0,
          border: el.borderWidth > 0 ? `${el.borderWidth}px solid ${el.borderColor}` : "none",
          boxShadow: el.boxShadow || "none",
        }}
      >
        <img
          alt=""
          draggable={false}
          className={styles.element__image}
          src={el.src}
          style={{
            objectFit: el.objectFit || "cover",
            objectPosition: `${positionX}% ${positionY}%`,
            transform: `scale(${imageScale})`,
            transformOrigin: `${positionX}% ${positionY}%`,
          }}
        />
      </div>
      {selected && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null}
    </div>
  );
});

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

  if (el.type === "text") {
    return (
      <TextElement
        {...sharedProps}
        editing={interactive && editing}
        onDblClick={handleDoubleClick}
        onTextChange={handleTextChange}
        onStopEditing={safeStopEditing}
      />
    );
  }

  if (el.type === "rect") {
    return <RectElement {...sharedProps} />;
  }

  if (el.type === "ellipse") {
    return <EllipseElement {...sharedProps} />;
  }

  if (el.type === "line") {
    return <LineElement {...sharedProps} />;
  }

  if (el.type === "image") {
    return <ImageElement {...sharedProps} />;
  }

  return null;
});
