import { useEffect, useMemo, useState } from "react";

import {
  A4_H,
  A4_W,
  RESIZE_HANDLES,
  SNAP_SIZE,
} from "./canvas/canvasEditor.constants.js";
import {
  SPLIT_TEMPLATE,
  cloneElements,
  createElement,
  newId,
  syncElementIdSeed,
} from "./canvas/canvasElementFactory.js";
import { applyResize, snapValue } from "./canvas/canvasGeometry.js";
import { buildLayerNameMap } from "./canvas/canvasLayers.js";
import { useCanvasDragResize } from "./canvas/useCanvasDragResize.js";
import { useCanvasElementActions } from "./canvas/useCanvasElementActions.js";
import { useCanvasSelection } from "./canvas/useCanvasSelection.js";
import { useCanvasShortcuts } from "./canvas/useCanvasShortcuts.js";

export {
  A4_H,
  A4_W,
  RESIZE_HANDLES,
  SNAP_SIZE,
  SPLIT_TEMPLATE,
  applyResize,
  buildLayerNameMap,
  createElement,
  newId,
  snapValue,
  syncElementIdSeed,
};

export function useCanvasEditor({
  elements: controlledElements,
  setElements: setControlledElements,
  templateElements: controlledTemplateElements,
  scale: controlledScale,
  setScale: setControlledScale,
  snapOn: controlledSnapOn,
  setSnapOn: setControlledSnapOn,
  languageCode = "DE",
} = {}) {
  const [internalElements, setInternalElements] = useState(() => {
    const seed = SPLIT_TEMPLATE();
    syncElementIdSeed(seed);
    return seed;
  });
  const [internalScale, setInternalScale] = useState(0.75);
  const [internalSnapOn, setInternalSnapOn] = useState(true);
  const [internalTemplateElements] = useState(() => cloneElements(internalElements));

  const elements = controlledElements ?? internalElements;
  const setElements = setControlledElements ?? setInternalElements;
  const templateElements = controlledTemplateElements ?? internalTemplateElements;
  const scale = controlledScale ?? internalScale;
  const setScale = setControlledScale ?? setInternalScale;
  const snapOn = controlledSnapOn ?? internalSnapOn;
  const setSnapOn = setControlledSnapOn ?? setInternalSnapOn;

  useEffect(() => {
    syncElementIdSeed(elements);
  }, [elements]);

  const selection = useCanvasSelection({ elements, languageCode });
  const actions = useCanvasElementActions({
    clearSelection: selection.clearSelection,
    elements,
    selectElement: selection.selectElement,
    setElements,
    templateElements,
  });
  const dragResize = useCanvasDragResize({
    editingId: selection.editingId,
    elements,
    scale,
    selectElement: selection.selectElement,
    snapOn,
    updateEl: actions.updateEl,
  });
  const layerNames = useMemo(() => buildLayerNameMap(elements, languageCode), [elements, languageCode]);

  useCanvasShortcuts({
    clearSelection: selection.clearSelection,
    deleteEl: actions.deleteEl,
    duplicateEl: actions.duplicateEl,
    editingId: selection.editingId,
    elements,
    selectedId: selection.selectedId,
    updateEl: actions.updateEl,
  });

  return {
    elements,
    scale,
    snapOn,
    selectedId: selection.selectedId,
    editingId: selection.editingId,
    isDragging: dragResize.isDragging,
    selectedEl: selection.selectedEl,
    selectedMeta: selection.selectedMeta,
    layerNames,
    setElements,
    setScale,
    setSnapOn,
    setSelectedId: selection.setSelectedId,
    setEditingId: selection.setEditingId,
    updateEl: actions.updateEl,
    addElement: actions.addElement,
    deleteEl: actions.deleteEl,
    duplicateEl: actions.duplicateEl,
    changeZOrder: actions.changeZOrder,
    resetToTemplate: actions.resetToTemplate,
    clearSelection: selection.clearSelection,
    selectElement: selection.selectElement,
    handleMouseMove: dragResize.handleMouseMove,
    handleMouseUp: dragResize.handleMouseUp,
    handleBodyMouseDown: dragResize.handleBodyMouseDown,
    handleResizeHandleMouseDown: dragResize.handleResizeHandleMouseDown,
    canvasRef: dragResize.canvasRef,
  };
}
