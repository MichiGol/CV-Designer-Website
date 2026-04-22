import { useCallback, useEffect, useRef, useState } from "react";
import { getElementTypeMeta } from "../config/layoutConfig.js";
import { A4_HEIGHT_PX, A4_WIDTH_PX } from "../config/pageSizes.js";

export const A4_W = A4_WIDTH_PX;
export const A4_H = A4_HEIGHT_PX;
export const SNAP_SIZE = 8;

export const RESIZE_HANDLES = [
  { id: "nw", cx: 0, cy: 0, cur: "nw-resize" },
  { id: "n", cx: 0.5, cy: 0, cur: "n-resize" },
  { id: "ne", cx: 1, cy: 0, cur: "ne-resize" },
  { id: "e", cx: 1, cy: 0.5, cur: "e-resize" },
  { id: "se", cx: 1, cy: 1, cur: "se-resize" },
  { id: "s", cx: 0.5, cy: 1, cur: "s-resize" },
  { id: "sw", cx: 0, cy: 1, cur: "sw-resize" },
  { id: "w", cx: 0, cy: 0.5, cur: "w-resize" },
];

const TYPE_DEFAULTS = {
  text: {
    content: "Neuer Text",
    fontSize: 16,
    fontWeight: "400",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    color: "#1a1a2e",
    bgColor: "transparent",
    fontFamily: "'DM Sans',sans-serif",
    letterSpacing: "normal",
    lineHeight: 1.5,
    width: 220,
    height: 56,
  },
  rect: {
    color: "#1e3a5f",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    width: 180,
    height: 110,
  },
  ellipse: {
    color: "#1e3a5f",
    borderColor: "transparent",
    borderWidth: 0,
    width: 110,
    height: 110,
  },
  line: {
    color: "#1e3a5f",
    width: 320,
    height: 3,
  },
  image: {
    src: "",
    objectFit: "cover",
    objectPositionX: 50,
    objectPositionY: 50,
    imageScale: 1,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    boxShadow: "none",
    width: 160,
    height: 160,
  },
};

let uidSeed = 1000;
export const newId = () => `el_${++uidSeed}`;

export function syncElementIdSeed(elements) {
  const maxSeed = elements.reduce((max, element) => {
    const match = `${element.id ?? ""}`.match(/^el_(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, uidSeed);

  uidSeed = Math.max(uidSeed, maxSeed);
}

function cloneElements(elements) {
  return elements.map(element => ({ ...element }));
}

export function createElement(type, overrides = {}) {
  return {
    id: newId(),
    type,
    x: 80,
    y: 80,
    zIndex: 1,
    opacity: 1,
    locked: false,
    ...TYPE_DEFAULTS[type],
    ...overrides,
  };
}

export const SPLIT_TEMPLATE = () => [
  // This seed layout is used both for first load and for "reset to template".
  createElement("rect", { id: "r_bg", x: 0, y: 0, width: A4_W, height: A4_H, color: "#ffffff", zIndex: 0, locked: true }),
  createElement("rect", { id: "r_top", x: 0, y: 0, width: A4_W, height: 150, color: "#1e3a5f", zIndex: 1, locked: true }),
  createElement("ellipse", { id: "e_glow", x: 560, y: -60, width: 220, height: 220, color: "#ffffff18", zIndex: 1, locked: true }),
  createElement("rect", { id: "r_side", x: 0, y: 150, width: 206, height: 973, color: "#f8fafc", zIndex: 1, locked: true }),
  createElement("text", { id: "t_name", x: 238, y: 54, width: 420, height: 42, content: "MAX MUSTERMANN", fontSize: 30, fontWeight: "700", color: "#ffffff", bgColor: "transparent", fontFamily: "'Cormorant Garamond',Georgia,serif", zIndex: 3 }),
  createElement("text", { id: "t_role", x: 240, y: 102, width: 320, height: 18, content: "Senior Softwarearchitekt", fontSize: 13, fontWeight: "400", color: "#dbeafe", bgColor: "transparent", zIndex: 3 }),
  createElement("rect", { id: "r_photo", x: 38, y: 32, width: 120, height: 120, color: "#ffffff18", borderColor: "#ffffff40", borderWidth: 2, borderRadius: 16, zIndex: 2 }),
  createElement("text", { id: "t_init", x: 56, y: 70, width: 84, height: 32, content: "MM", fontSize: 32, fontWeight: "700", color: "#ffffff", bgColor: "transparent", fontFamily: "'Cormorant Garamond',Georgia,serif", textAlign: "center", zIndex: 3 }),
  createElement("text", { id: "s_lab1", x: 28, y: 192, width: 150, height: 14, content: "KONTAKT", fontSize: 9, fontWeight: "700", color: "#1e3a5f", bgColor: "transparent", zIndex: 3 }),
  createElement("line", { id: "s_lin1", x: 28, y: 212, width: 150, height: 1, color: "#dbe4f0", zIndex: 3 }),
  createElement("text", { id: "s_txt1", x: 28, y: 224, width: 150, height: 84, content: "m.berger@techmail.de\n+49 89 123 456 78\nMünchen, Bayern\nmaxberger.dev", fontSize: 11, lineHeight: 1.75, color: "#475569", bgColor: "transparent", zIndex: 3 }),
  createElement("text", { id: "s_lab2", x: 28, y: 350, width: 150, height: 14, content: "FÄHIGKEITEN", fontSize: 9, fontWeight: "700", color: "#1e3a5f", bgColor: "transparent", zIndex: 3 }),
  createElement("line", { id: "s_lin2", x: 28, y: 370, width: 150, height: 1, color: "#dbe4f0", zIndex: 3 }),
  createElement("text", { id: "s_txt2", x: 28, y: 382, width: 150, height: 150, content: "React / TypeScript\nNode.js / Go\nDocker / Kubernetes\nAWS / Azure\nPostgreSQL / Redis", fontSize: 11, lineHeight: 1.75, color: "#475569", bgColor: "transparent", zIndex: 3 }),
  createElement("text", { id: "m_suml", x: 244, y: 210, width: 520, height: 14, content: "PROFIL", fontSize: 8, fontWeight: "700", color: "#1e3a5f", bgColor: "transparent", zIndex: 4 }),
  createElement("line", { id: "m_sumr", x: 244, y: 228, width: 520, height: 1, color: "#e2e8f0", zIndex: 4 }),
  createElement("text", { id: "m_sumb", x: 244, y: 236, width: 520, height: 88, content: "Visionärer Softwarearchitekt mit über 10 Jahren Erfahrung in der Entwicklung skalierbarer Cloud-Systeme. Leidenschaftlich für Clean Code, agile Methoden und eine starke Mentoring-Kultur.", fontSize: 11, color: "#475569", bgColor: "transparent", zIndex: 4, lineHeight: 1.7 }),
  createElement("text", { id: "m_exlbl", x: 244, y: 340, width: 520, height: 14, content: "BERUFSERFAHRUNG", fontSize: 8, fontWeight: "700", color: "#1e3a5f", bgColor: "transparent", zIndex: 4 }),
  createElement("line", { id: "m_exrul", x: 244, y: 358, width: 520, height: 1, color: "#e2e8f0", zIndex: 4 }),
  createElement("text", { id: "m_ex1r", x: 244, y: 366, width: 380, height: 20, content: "Leitender Softwarearchitekt", fontSize: 13, fontWeight: "700", color: "#0f172a", bgColor: "transparent", zIndex: 4 }),
  createElement("text", { id: "m_ex1p", x: 580, y: 366, width: 184, height: 18, content: "2019 - Heute", fontSize: 10, color: "#94a3b8", bgColor: "transparent", zIndex: 4, textAlign: "right" }),
  createElement("text", { id: "m_ex1c", x: 244, y: 386, width: 280, height: 18, content: "CloudSphere GmbH", fontSize: 11, fontWeight: "600", color: "#1e3a5f", bgColor: "transparent", zIndex: 4 }),
  createElement("text", { id: "m_ex1b", x: 244, y: 408, width: 520, height: 64, content: "Entwurf einer Microservices-Plattform für 2M+ Nutzer. Technische Leitung eines 12-köpfigen Teams.", fontSize: 11, color: "#475569", bgColor: "transparent", zIndex: 4, lineHeight: 1.65 }),
];

export function snapValue(value, enabled) {
  return enabled ? Math.round(value / SNAP_SIZE) * SNAP_SIZE : value;
}

export function applyResize(handle, { x, y, width: widthValue, height: heightValue }, dx, dy) {
  const minW = 20;
  const minH = 6;
  const clampW = delta => Math.max(minW, widthValue + delta);
  const clampH = delta => Math.max(minH, heightValue + delta);

  switch (handle) {
    case "se":
      return { x, y, width: clampW(dx), height: clampH(dy) };
    case "sw": {
      const width = clampW(-dx);
      return { x: x + widthValue - width, y, width, height: clampH(dy) };
    }
    case "ne": {
      const height = clampH(-dy);
      return { x, y: y + heightValue - height, width: clampW(dx), height };
    }
    case "nw": {
      const width = clampW(-dx);
      const height = clampH(-dy);
      return { x: x + widthValue - width, y: y + heightValue - height, width, height };
    }
    case "n": {
      const height = clampH(-dy);
      return { x, y: y + heightValue - height, width: widthValue, height };
    }
    case "s":
      return { x, y, width: widthValue, height: clampH(dy) };
    case "e":
      return { x, y, width: clampW(dx), height: heightValue };
    case "w": {
      const width = clampW(-dx);
      return { x: x + widthValue - width, y, width, height: heightValue };
    }
    default:
      return { x, y, width: widthValue, height: heightValue };
  }
}

export function buildLayerNameMap(elements) {
  const counts = {};
  const names = new Map();

  [...elements]
    .sort((a, b) => a.zIndex - b.zIndex)
    .forEach(element => {
      counts[element.type] = (counts[element.type] ?? 0) + 1;
      names.set(element.id, `${getElementTypeMeta(element.type).label} ${counts[element.type]}`);
    });

  return names;
}

export function useCanvasEditor({
  elements: controlledElements,
  setElements: setControlledElements,
  templateElements: controlledTemplateElements,
  scale: controlledScale,
  setScale: setControlledScale,
  snapOn: controlledSnapOn,
  setSnapOn: setControlledSnapOn,
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

  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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

  useEffect(() => {
    if (selectedId && !elements.some(element => element.id === selectedId)) {
      setSelectedId(null);
    }
  }, [elements, selectedId]);

  useEffect(() => {
    syncElementIdSeed(elements);
  }, [elements]);

  const selectedEl = elements.find(element => element.id === selectedId) ?? null;
  const selectedMeta = selectedEl ? getElementTypeMeta(selectedEl.type) : null;
  const layerNames = buildLayerNameMap(elements);

  const updateEl = useCallback(
    (id, patch) => {
      setElements(current =>
        current.map(element => (element.id === id ? { ...element, ...patch } : element)),
      );
    },
    [setElements],
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    setEditingId(null);
  }, []);

  const selectElement = useCallback(id => {
    setSelectedId(id);
    setEditingId(null);
  }, []);

  const deleteEl = useCallback(
    id => {
      setElements(current => current.filter(element => element.id !== id));
      clearSelection();
    },
    [clearSelection, setElements],
  );

  const duplicateEl = useCallback(
    id => {
      setElements(current => {
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
      });
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
      setElements(current => {
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
      });
    },
    [setElements],
  );

  const resetToTemplate = useCallback(() => {
    const seed = cloneElements(templateElements?.length ? templateElements : SPLIT_TEMPLATE());
    syncElementIdSeed(seed);
    setElements(seed);
    clearSelection();
  }, [clearSelection, setElements, templateElements]);

  const toCanvasCoords = useCallback((clientX, clientY) => {
    const rect = canvasRef.current?.getBoundingClientRect();

    if (!rect) {
      return { x: 0, y: 0 };
    }

    return {
      x: (clientX - rect.left) / scaleRef.current,
      y: (clientY - rect.top) / scaleRef.current,
    };
  }, []);

  const handleBodyMouseDown = useCallback(
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

      // Capture the starting geometry once so every drag frame is calculated from
      // the same baseline instead of accumulating rounding errors.
      const position = toCanvasCoords(event.clientX, event.clientY);
      interactRef.current = {
        type: "drag",
        id,
        sx: position.x,
        sy: position.y,
        ex: element.x,
        ey: element.y,
        ew: element.width,
        eh: element.height,
      };
      setIsDragging(true);
    },
    [editingId, elements, selectElement, toCanvasCoords],
  );

  const handleResizeHandleMouseDown = useCallback(
    (event, id, handle) => {
      if (event.button !== 0) {
        return;
      }

      const element = elements.find(item => item.id === id);

      if (!element || element.locked) {
        return;
      }

      selectElement(id);
      const position = toCanvasCoords(event.clientX, event.clientY);
      interactRef.current = {
        type: "resize",
        handle,
        id,
        sx: position.x,
        sy: position.y,
        ex: element.x,
        ey: element.y,
        ew: element.width,
        eh: element.height,
      };
      setIsDragging(true);
      event.preventDefault();
      event.stopPropagation();
    },
    [elements, selectElement, toCanvasCoords],
  );

  const handleMouseMove = useCallback(
    event => {
      if (!interactRef.current) {
        return;
      }

      const { type, handle, id, sx, sy, ex, ey, ew, eh } = interactRef.current;
      const position = toCanvasCoords(event.clientX, event.clientY);
      const snap = snapRef.current;
      const dx = position.x - sx;
      const dy = position.y - sy;

      if (type === "drag") {
        // Keep dragged elements close enough to the page that they are hard to lose.
        updateEl(id, {
          x: snapValue(Math.max(-ew + 20, Math.min(A4_W - 20, ex + dx)), snap),
          y: snapValue(Math.max(-eh + 10, Math.min(A4_H - 10, ey + dy)), snap),
        });
        return;
      }

      const resized = applyResize(handle, { x: ex, y: ey, width: ew, height: eh }, dx, dy);
      updateEl(id, {
        x: snapValue(resized.x, snap),
        y: snapValue(resized.y, snap),
        width: snapValue(resized.width, snap),
        height: snapValue(resized.height, snap),
      });
    },
    [toCanvasCoords, updateEl],
  );

  const handleMouseUp = useCallback(() => {
    interactRef.current = null;
    setIsDragging(false);
  }, []);

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
        setSelectedId(null);
        setEditingId(null);
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
  }, [deleteEl, duplicateEl, editingId, elements, selectedId, updateEl]);

  return {
    elements,
    scale,
    snapOn,
    selectedId,
    editingId,
    isDragging,
    selectedEl,
    selectedMeta,
    layerNames,
    setElements,
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
  };
}
