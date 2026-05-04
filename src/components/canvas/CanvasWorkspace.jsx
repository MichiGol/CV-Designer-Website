import { memo, useMemo } from "react";
import cx from "clsx";

import { A4_H, A4_W, SNAP_SIZE } from "../../hooks/useCanvasEditor.js";
import { CanvasElement } from "../CanvasElement.jsx";
import { FloatingContextBar, LayersPanel } from "../LayersAndContextBar.jsx";
import { PropertiesPanel } from "../PropertiesPanel.jsx";
import styles from "../CanvasEditor.module.scss";

function getCanvasStyleVars(scale) {
  return {
    "--canvas-display-height": `${A4_H * scale}px`,
    "--canvas-display-width": `${A4_W * scale}px`,
    "--canvas-grid-size": `${SNAP_SIZE}px`,
    "--canvas-page-height": `${A4_H}px`,
    "--canvas-page-scale": scale,
    "--canvas-page-width": `${A4_W}px`,
  };
}

export const CanvasWorkspace = memo(function CanvasWorkspace({
  canvasRef,
  editingId,
  elements,
  layerNames,
  scale,
  selectedEl,
  snapOn,
  sortedElements,
  onCanvasMouseDown,
  onElementBodyDown,
  onElementDoubleClick,
  onElementResizeDown,
  onElementStopEditing,
  onElementTextChange,
  onFloatingDelete,
  onFloatingDuplicate,
  onFloatingLock,
  onFloatingZChange,
  onSelectedDelete,
  onSelectedDuplicate,
  onSelectedUpdate,
  onSelectedZChange,
  onSelectElement,
  onSnapToggle,
}) {
  const canvasStyleVars = useMemo(() => getCanvasStyleVars(scale), [scale]);

  return (
    <div className={styles.body}>
      <LayersPanel
        elements={elements}
        selectedId={selectedEl?.id}
        layerNames={layerNames}
        onSelect={onSelectElement}
      />

      <div className={cx(styles.canvasArea, "cv-scroll")}>
        <div className={styles.canvasWrapper} style={canvasStyleVars}>
          <div
            ref={canvasRef}
            className={styles.canvasPage}
            onMouseDown={onCanvasMouseDown}
          >
            {snapOn ? <div className={styles.canvasGrid} /> : null}

            {sortedElements.map(el => (
              <CanvasElement
                key={el.id}
                el={el}
                selected={selectedEl?.id === el.id}
                editing={editingId === el.id}
                onBodyDown={onElementBodyDown}
                onHandleDown={onElementResizeDown}
                onDblClick={onElementDoubleClick}
                onTextChange={onElementTextChange}
                onStopEditing={onElementStopEditing}
              />
            ))}
          </div>

          {selectedEl && !editingId ? (
            <FloatingContextBar
              el={selectedEl}
              scale={scale}
              onDelete={onFloatingDelete}
              onDuplicate={onFloatingDuplicate}
              onLock={onFloatingLock}
              onZChange={onFloatingZChange}
            />
          ) : null}
        </div>
      </div>

      <PropertiesPanel
        el={selectedEl}
        snapOn={snapOn}
        onUpdate={onSelectedUpdate}
        onDelete={onSelectedDelete}
        onDuplicate={onSelectedDuplicate}
        onZChange={onSelectedZChange}
        onSnapToggle={onSnapToggle}
      />
    </div>
  );
});
