import { useEffect } from "react";

import { SNAP_SIZE } from "./canvasEditor.constants.js";

export function useCanvasShortcuts({
  clearSelection,
  deleteEl,
  duplicateEl,
  editingId,
  elements,
  selectedId,
  updateEl,
}) {
  useEffect(() => {
    const onKeyDown = event => {
      if (editingId) {
        return;
      }

      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        deleteEl(selectedId);
        return;
      }

      if (event.key === "Escape") {
        clearSelection();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key === "d") {
        event.preventDefault();

        if (selectedId) {
          duplicateEl(selectedId);
        }

        return;
      }

      if (!selectedId) {
        return;
      }

      const element = elements.find(item => item.id === selectedId);

      if (!element) {
        return;
      }

      const step = event.shiftKey ? SNAP_SIZE * 2 : SNAP_SIZE;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateEl(selectedId, { x: element.x - step });
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        updateEl(selectedId, { x: element.x + step });
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        updateEl(selectedId, { y: element.y - step });
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        updateEl(selectedId, { y: element.y + step });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearSelection, deleteEl, duplicateEl, editingId, elements, selectedId, updateEl]);
}
