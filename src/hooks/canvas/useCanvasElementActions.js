import { useCallback } from "react";

import {
  SPLIT_TEMPLATE,
  cloneElements,
  createElement,
  newId,
  syncElementIdSeed,
} from "./canvasElementFactory.js";

function duplicateElement(current, id) {
  const element = current.find(item => item.id === id);

  if (!element) {
    return current;
  }

  return [
    ...current,
    {
      ...element,
      id: newId(),
      x: element.x + 16,
      y: element.y + 16,
      zIndex: element.zIndex + 1,
    },
  ];
}

function moveElementInZOrder(current, id, direction) {
  const ordered = [...current].sort((a, b) => a.zIndex - b.zIndex);
  const index = ordered.findIndex(element => element.id === id);

  if (index < 0) {
    return current;
  }

  if (direction === "front") {
    ordered[index] = { ...ordered[index], zIndex: ordered[ordered.length - 1].zIndex + 1 };
  } else if (direction === "back") {
    ordered[index] = { ...ordered[index], zIndex: ordered[0].zIndex - 1 };
  } else if (direction === "up" && index < ordered.length - 1) {
    const nextZ = ordered[index + 1].zIndex;
    ordered[index + 1] = { ...ordered[index + 1], zIndex: ordered[index].zIndex };
    ordered[index] = { ...ordered[index], zIndex: nextZ };
  } else if (direction === "down" && index > 0) {
    const previousZ = ordered[index - 1].zIndex;
    ordered[index - 1] = { ...ordered[index - 1], zIndex: ordered[index].zIndex };
    ordered[index] = { ...ordered[index], zIndex: previousZ };
  }

  return ordered;
}

function buildTemplateSeed(templateElements) {
  const seed = cloneElements(templateElements?.length ? templateElements : SPLIT_TEMPLATE());
  syncElementIdSeed(seed);
  return seed;
}

export function useCanvasElementActions({
  clearSelection,
  elements,
  selectElement,
  setElements,
  templateElements,
}) {
  const updateEl = useCallback(
    (id, patch) => {
      setElements(current =>
        current.map(element => (element.id === id ? { ...element, ...patch } : element)),
      );
    },
    [setElements],
  );

  const deleteEl = useCallback(
    id => {
      setElements(current => current.filter(element => element.id !== id));
      clearSelection();
    },
    [clearSelection, setElements],
  );

  const duplicateEl = useCallback(
    id => {
      setElements(current => duplicateElement(current, id));
    },
    [setElements],
  );

  const addElement = useCallback(
    type => {
      const maxZ = elements.reduce((max, element) => Math.max(max, element.zIndex), 0);
      const element = createElement(type, { x: 100, y: 120, zIndex: maxZ + 1 });

      setElements(current => [...current, element]);
      selectElement(element.id);
    },
    [elements, selectElement, setElements],
  );

  const changeZOrder = useCallback(
    (id, direction) => {
      setElements(current => moveElementInZOrder(current, id, direction));
    },
    [setElements],
  );

  const resetToTemplate = useCallback(() => {
    setElements(buildTemplateSeed(templateElements));
    clearSelection();
  }, [clearSelection, setElements, templateElements]);

  return {
    addElement,
    changeZOrder,
    deleteEl,
    duplicateEl,
    resetToTemplate,
    updateEl,
  };
}
