import { useCallback, useEffect, useRef, useState } from "react";

import { A4_H, A4_W } from "./canvasEditor.constants.js";
import { applyResize, snapValue } from "./canvasGeometry.js";

function toCanvasCoords(canvasRef, scaleRef, clientX, clientY) {
  const rect = canvasRef.current?.getBoundingClientRect();

  if (!rect) {
    return { x: 0, y: 0 };
  }

  return {
    x: (clientX - rect.left) / scaleRef.current,
    y: (clientY - rect.top) / scaleRef.current,
  };
}

function buildInteraction(type, element, position, patch = {}) {
  return {
    type,
    id: element.id,
    sx: position.x,
    sy: position.y,
    ex: element.x,
    ey: element.y,
    ew: element.width,
    eh: element.height,
    ...patch,
  };
}

function getDragPatch(interaction, position, snap) {
  const dx = position.x - interaction.sx;
  const dy = position.y - interaction.sy;

  return {
    x: snapValue(Math.max(-interaction.ew + 20, Math.min(A4_W - 20, interaction.ex + dx)), snap),
    y: snapValue(Math.max(-interaction.eh + 10, Math.min(A4_H - 10, interaction.ey + dy)), snap),
  };
}

function getResizePatch(interaction, position, snap) {
  const resized = applyResize(
    interaction.handle,
    { x: interaction.ex, y: interaction.ey, width: interaction.ew, height: interaction.eh },
    position.x - interaction.sx,
    position.y - interaction.sy,
  );

  return {
    x: snapValue(resized.x, snap),
    y: snapValue(resized.y, snap),
    width: snapValue(resized.width, snap),
    height: snapValue(resized.height, snap),
  };
}

function useCanvasInteractionRefs({ scale, snapOn }) {
  const canvasRef = useRef(null);
  const interactRef = useRef(null);
  const scaleRef = useRef(scale);
  const snapRef = useRef(snapOn);

  // Drag handlers keep running between renders, so refs keep the latest zoom and
  // snap state available without recreating every mouse callback.
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    snapRef.current = snapOn;
  }, [snapOn]);

  const getCanvasPosition = useCallback(
    (clientX, clientY) => toCanvasCoords(canvasRef, scaleRef, clientX, clientY),
    [],
  );

  return {
    canvasRef,
    getCanvasPosition,
    interactRef,
    snapRef,
  };
}

function useCanvasDragStart({
  editingId,
  elements,
  getCanvasPosition,
  interactRef,
  selectElement,
  setIsDragging,
}) {
  return useCallback(
    (event, id) => {
      if (event.button !== 0) {
        return;
      }

      const element = elements.find(item => item.id === id);

      if (!element) {
        return;
      }

      selectElement(id);
      event.preventDefault();

      if (element.locked || editingId === id) {
        return;
      }

      const position = getCanvasPosition(event.clientX, event.clientY);
      interactRef.current = buildInteraction("drag", element, position);
      setIsDragging(true);
    },
    [editingId, elements, getCanvasPosition, interactRef, selectElement, setIsDragging],
  );
}

function useCanvasResizeStart({
  elements,
  getCanvasPosition,
  interactRef,
  selectElement,
  setIsDragging,
}) {
  return useCallback(
    (event, id, handle) => {
      if (event.button !== 0) {
        return;
      }

      const element = elements.find(item => item.id === id);

      if (!element || element.locked) {
        return;
      }

      selectElement(id);
      interactRef.current = buildInteraction(
        "resize",
        element,
        getCanvasPosition(event.clientX, event.clientY),
        { handle },
      );
      setIsDragging(true);
      event.preventDefault();
      event.stopPropagation();
    },
    [elements, getCanvasPosition, interactRef, selectElement, setIsDragging],
  );
}

function useCanvasPointerMove({ getCanvasPosition, interactRef, setIsDragging, snapRef, updateEl }) {
  const handleMouseMove = useCallback(
    event => {
      if (!interactRef.current) {
        return;
      }

      const interaction = interactRef.current;
      const position = getCanvasPosition(event.clientX, event.clientY);
      const patch = interaction.type === "drag"
        ? getDragPatch(interaction, position, snapRef.current)
        : getResizePatch(interaction, position, snapRef.current);

      updateEl(interaction.id, patch);
    },
    [getCanvasPosition, interactRef, snapRef, updateEl],
  );

  const handleMouseUp = useCallback(() => {
    interactRef.current = null;
    setIsDragging(false);
  }, [interactRef, setIsDragging]);

  return {
    handleMouseMove,
    handleMouseUp,
  };
}

export function useCanvasDragResize({
  editingId,
  elements,
  scale,
  selectElement,
  snapOn,
  updateEl,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const { canvasRef, getCanvasPosition, interactRef, snapRef } = useCanvasInteractionRefs({
    scale,
    snapOn,
  });
  const handleBodyMouseDown = useCanvasDragStart({
    editingId,
    elements,
    getCanvasPosition,
    interactRef,
    selectElement,
    setIsDragging,
  });
  const handleResizeHandleMouseDown = useCanvasResizeStart({
    elements,
    getCanvasPosition,
    interactRef,
    selectElement,
    setIsDragging,
  });
  const { handleMouseMove, handleMouseUp } = useCanvasPointerMove({
    getCanvasPosition,
    interactRef,
    setIsDragging,
    snapRef,
    updateEl,
  });

  return {
    canvasRef,
    handleBodyMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResizeHandleMouseDown,
    isDragging,
  };
}
