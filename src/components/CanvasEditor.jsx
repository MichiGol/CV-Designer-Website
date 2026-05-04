import { useCallback, useMemo, useRef } from "react";
import cx from "clsx";

import { useLanguage } from "../context/LanguageContext.jsx";
import { useCanvasEditor } from "../hooks/useCanvasEditor.js";
import { useCanvasPdfExport } from "../hooks/useCanvasPdfExport.js";
import { CanvasExportSurface } from "./canvas/CanvasExportSurface.jsx";
import { CanvasStatusBar } from "./canvas/CanvasStatusBar.jsx";
import { CanvasToolbar } from "./canvas/CanvasToolbar.jsx";
import { CanvasWorkspace } from "./canvas/CanvasWorkspace.jsx";

import styles from "./CanvasEditor.module.scss";

export function CanvasEditor({
  elements: propElements,
  setElements: propSetElements,
  templateSeed: propTemplateSeed,
  scale: propScale,
  setScale: propSetScale,
  snapOn: propSnapOn,
  setSnapOn: propSetSnapOn,
}) {
  const { languageCode } = useLanguage();
  const {
    elements,
    scale,
    snapOn,
    selectedEl,
    editingId,
    isDragging,
    layerNames,
    selectedMeta,
    setScale,
    setSnapOn,
    setSelectedId,
    setEditingId,
    updateEl,
    addElement,
    deleteEl,
    duplicateEl,
    changeZOrder,
    resetToTemplate,
    clearSelection,
    selectElement,
    handleMouseMove,
    handleMouseUp,
    handleBodyMouseDown,
    handleResizeHandleMouseDown,
    canvasRef,
  } = useCanvasEditor({
    elements: propElements,
    setElements: propSetElements,
    templateElements: propTemplateSeed,
    scale: propScale,
    setScale: propSetScale,
    snapOn: propSnapOn,
    setSnapOn: propSetSnapOn,
    languageCode,
  });
  const { exportPageRef, exportPdf, isExporting } = useCanvasPdfExport();
  const actionRef = useRef(null);
  const sortedElements = useMemo(
    () => [...elements].sort((a, b) => a.zIndex - b.zIndex),
    [elements],
  );

  actionRef.current = {
    addElement,
    changeZOrder,
    clearSelection,
    deleteEl,
    duplicateEl,
    handleBodyMouseDown,
    handleResizeHandleMouseDown,
    resetToTemplate,
    selectedEl,
    setEditingId,
    setScale,
    setSelectedId,
    setSnapOn,
    updateEl,
  };

  const handleAddElement = useCallback(type => {
    actionRef.current?.addElement(type);
  }, []);

  const handleResetTemplate = useCallback(() => {
    actionRef.current?.resetToTemplate();
  }, []);

  const handleToggleSnap = useCallback(() => {
    actionRef.current?.setSnapOn(current => !current);
  }, []);

  const handleScaleChange = useCallback(nextScale => {
    actionRef.current?.setScale(nextScale);
  }, []);

  const handleCanvasMouseDown = useCallback(
    event => {
      if (event.target === canvasRef.current) {
        actionRef.current?.clearSelection();
      }
    },
    [canvasRef],
  );

  const handleElementBodyDown = useCallback((event, id) => {
    actionRef.current?.handleBodyMouseDown(event, id);
  }, []);

  const handleElementResizeDown = useCallback((event, id, handle) => {
    actionRef.current?.handleResizeHandleMouseDown(event, id, handle);
  }, []);

  const handleElementDoubleClick = useCallback((id, type) => {
    if (type !== "text") {
      return;
    }

    actionRef.current?.setSelectedId(id);
    actionRef.current?.setEditingId(id);
  }, []);

  const handleElementTextChange = useCallback((id, value) => {
    actionRef.current?.updateEl(id, { content: value });
  }, []);

  const handleElementStopEditing = useCallback(() => {
    actionRef.current?.setEditingId(null);
  }, []);

  const handleSelectedUpdate = useCallback(patch => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.updateEl(currentSelected.id, patch);
    }
  }, []);

  const handleSelectedDelete = useCallback(() => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.deleteEl(currentSelected.id);
    }
  }, []);

  const handleSelectedDuplicate = useCallback(() => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.duplicateEl(currentSelected.id);
    }
  }, []);

  const handleSelectedLock = useCallback(() => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.updateEl(currentSelected.id, { locked: !currentSelected.locked });
    }
  }, []);

  const handleSelectedZChange = useCallback(direction => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.changeZOrder(currentSelected.id, direction);
    }
  }, []);

  return (
    <div
      className={cx(styles.editor, { [styles["editor--dragging"]]: isDragging })}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <CanvasToolbar
        snapOn={snapOn}
        scale={scale}
        isExporting={isExporting}
        onAddElement={handleAddElement}
        onResetTemplate={handleResetTemplate}
        onToggleSnap={handleToggleSnap}
        onScaleChange={handleScaleChange}
        onExport={exportPdf}
      />

      <CanvasExportSurface elements={sortedElements} exportPageRef={exportPageRef} />

      <CanvasWorkspace
        canvasRef={canvasRef}
        editingId={editingId}
        elements={elements}
        layerNames={layerNames}
        scale={scale}
        selectedEl={selectedEl}
        snapOn={snapOn}
        sortedElements={sortedElements}
        onCanvasMouseDown={handleCanvasMouseDown}
        onElementBodyDown={handleElementBodyDown}
        onElementDoubleClick={handleElementDoubleClick}
        onElementResizeDown={handleElementResizeDown}
        onElementStopEditing={handleElementStopEditing}
        onElementTextChange={handleElementTextChange}
        onFloatingDelete={handleSelectedDelete}
        onFloatingDuplicate={handleSelectedDuplicate}
        onFloatingLock={handleSelectedLock}
        onFloatingZChange={handleSelectedZChange}
        onSelectedDelete={handleSelectedDelete}
        onSelectedDuplicate={handleSelectedDuplicate}
        onSelectedUpdate={handleSelectedUpdate}
        onSelectedZChange={handleSelectedZChange}
        onSelectElement={selectElement}
        onSnapToggle={handleToggleSnap}
      />

      <CanvasStatusBar
        elements={elements}
        selectedEl={selectedEl}
        selectedMeta={selectedMeta}
        scale={scale}
      />
    </div>
  );
}
