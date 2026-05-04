import { useCallback, useEffect, useMemo, useState } from "react";

import { getElementTypeMeta } from "../../config/layoutConfig.js";

export function useCanvasSelection({ elements, languageCode = "DE" }) {
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (selectedId && !elements.some(element => element.id === selectedId)) {
      setSelectedId(null);
    }
  }, [elements, selectedId]);

  const selectedEl = useMemo(
    () => elements.find(element => element.id === selectedId) ?? null,
    [elements, selectedId],
  );
  const selectedMeta = useMemo(
    () => (selectedEl ? getElementTypeMeta(selectedEl.type, languageCode) : null),
    [languageCode, selectedEl],
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    setEditingId(null);
  }, []);

  const selectElement = useCallback(id => {
    setSelectedId(id);
    setEditingId(null);
  }, []);

  return {
    clearSelection,
    editingId,
    selectedEl,
    selectedId,
    selectedMeta,
    selectElement,
    setEditingId,
    setSelectedId,
  };
}
