import { STORAGE_KEYS } from "../config/storageKeys.js";
import { A4_H, A4_W, SPLIT_TEMPLATE, newId } from "../hooks/useCanvasEditor.js";
import { setStoredValue } from "../storage/appDatabase.js";

const TEXT_TAGS = new Set(["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LABEL", "STRONG", "EM"]);

const BORDER_SIDE_CONFIG = [
  {
    colorKey: "borderTopColor",
    widthKey: "borderTopWidth",
    toRect: (rect, thickness) => ({ x: rect.x, y: rect.y, width: rect.width, height: thickness }),
  },
  {
    colorKey: "borderRightColor",
    widthKey: "borderRightWidth",
    toRect: (rect, thickness) => ({ x: rect.x + rect.width - thickness, y: rect.y, width: thickness, height: rect.height }),
  },
  {
    colorKey: "borderBottomColor",
    widthKey: "borderBottomWidth",
    toRect: (rect, thickness) => ({ x: rect.x, y: rect.y + rect.height - thickness, width: rect.width, height: thickness }),
  },
  {
    colorKey: "borderLeftColor",
    widthKey: "borderLeftWidth",
    toRect: (rect, thickness) => ({ x: rect.x, y: rect.y, width: thickness, height: rect.height }),
  },
];

export function cloneCanvasElements(elements) {
  return elements.map(element => ({ ...element }));
}

function waitForPaint() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function normalizeText(text) {
  return (text ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function applyTextTransform(text, textTransform) {
  if (!text) {
    return text;
  }

  if (textTransform === "uppercase") {
    return text.toUpperCase();
  }

  if (textTransform === "lowercase") {
    return text.toLowerCase();
  }

  if (textTransform === "capitalize") {
    return text.replace(/\b(\p{L})/gu, match => match.toUpperCase());
  }

  return text;
}

function parsePx(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseObjectPositionToken(value, fallback = 50) {
  const normalized = `${value ?? ""}`.trim().toLowerCase();

  if (!normalized) {
    return fallback;
  }

  if (normalized === "left" || normalized === "top") {
    return 0;
  }

  if (normalized === "center") {
    return 50;
  }

  if (normalized === "right" || normalized === "bottom") {
    return 100;
  }

  if (normalized.endsWith("%")) {
    return clamp(parsePx(normalized, fallback), 0, 100);
  }

  const numeric = Number.parseFloat(normalized);
  return Number.isFinite(numeric) ? clamp(numeric, 0, 100) : fallback;
}

function parseObjectPosition(value) {
  const tokens = `${value ?? ""}`
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return { x: 50, y: 50 };
  }

  if (tokens.length === 1) {
    return { x: parseObjectPositionToken(tokens[0], 50), y: 50 };
  }

  return {
    x: parseObjectPositionToken(tokens[0], 50),
    y: parseObjectPositionToken(tokens[1], 50),
  };
}

function parseScaleTransform(value) {
  const rawValue = `${value ?? ""}`.trim();

  if (!rawValue || rawValue === "none") {
    return 1;
  }

  const scaleMatch = rawValue.match(/scale\(([^)]+)\)/i);

  if (scaleMatch) {
    return clamp(parsePx(scaleMatch[1], 1), 1, 3);
  }

  const matrixMatch = rawValue.match(/matrix\(([^)]+)\)/i);

  if (!matrixMatch) {
    return 1;
  }

  const [firstValue = "1"] = matrixMatch[1].split(",").map(part => part.trim());
  return clamp(Math.abs(parsePx(firstValue, 1)), 1, 3);
}

function parseLineHeight(style, fontSize) {
  if (!style.lineHeight || style.lineHeight === "normal") {
    return 1.35;
  }

  if (style.lineHeight.endsWith("px")) {
    return Math.max(1, parsePx(style.lineHeight, fontSize * 1.35) / fontSize);
  }

  const numeric = Number.parseFloat(style.lineHeight);
  return Number.isFinite(numeric) ? numeric : 1.35;
}

function isTransparentColor(color) {
  return !color || color === "transparent" || color === "rgba(0, 0, 0, 0)" || color === "rgba(0,0,0,0)";
}

function isVisible(style, rect) {
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    parsePx(style.opacity, 1) > 0 &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function toCanvasRect(rect, rootRect) {
  return {
    x: Math.round((rect.left - rootRect.left) * 100) / 100,
    y: Math.round((rect.top - rootRect.top) * 100) / 100,
    width: Math.max(1, Math.round(rect.width * 100) / 100),
    height: Math.max(1, Math.round(rect.height * 100) / 100),
  };
}

function hasMeaningfulDirectTextNode(element) {
  return Array.from(element.childNodes).some(
    node => node.nodeType === Node.TEXT_NODE && normalizeText(node.textContent),
  );
}

function getVisibleChildren(element) {
  return Array.from(element.children).filter(child => {
    if (child.tagName === "BR") {
      return false;
    }

    const rect = child.getBoundingClientRect();
    return isVisible(window.getComputedStyle(child), rect);
  });
}

function shouldCaptureText(element, style) {
  if (element.tagName === "SVG" || element.tagName === "IMG" || element.closest("svg")) {
    return false;
  }

  const text = normalizeText(element.innerText || element.textContent);

  if (!text) {
    return false;
  }

  if (TEXT_TAGS.has(element.tagName)) {
    return true;
  }

  const visibleChildren = getVisibleChildren(element);

  if (visibleChildren.length === 0) {
    return true;
  }

  return hasMeaningfulDirectTextNode(element) && !["GRID", "TABLE"].includes(style.display?.toUpperCase?.());
}

function getUniformBorder(style) {
  const widths = BORDER_SIDE_CONFIG.map(side => parsePx(style[side.widthKey]));
  const colors = BORDER_SIDE_CONFIG.map(side => style[side.colorKey]);
  const firstWidth = widths[0];
  const firstColor = colors[0];
  const hasVisibleBorder = widths.some((width, index) => width > 0 && !isTransparentColor(colors[index]));

  if (!hasVisibleBorder) {
    return null;
  }

  const isUniform =
    widths.every(width => Math.abs(width - firstWidth) < 0.1) &&
    colors.every(color => color === firstColor);

  return isUniform ? { color: firstColor, width: firstWidth } : null;
}

function getBorderSegments(style, rect) {
  return BORDER_SIDE_CONFIG.flatMap(side => {
    const thickness = parsePx(style[side.widthKey]);
    const color = style[side.colorKey];

    if (thickness <= 0 || isTransparentColor(color)) {
      return [];
    }

    return [{ ...side.toRect(rect, thickness), color }];
  });
}

function isEllipseShape(style, rect) {
  if (!style.borderRadius.includes("%")) {
    return false;
  }

  return Math.abs(rect.width - rect.height) <= Math.max(rect.width, rect.height) * 0.22;
}

function isLineShape(rect) {
  return rect.height <= 4 || rect.width <= 4;
}

function serializeSvg(svgElement) {
  const clone = svgElement.cloneNode(true);
  const width = svgElement.getAttribute("width") || svgElement.getBoundingClientRect().width || A4_W;
  const height = svgElement.getAttribute("height") || svgElement.getBoundingClientRect().height || A4_H;

  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  if (!clone.getAttribute("xmlns:xlink")) {
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  }

  if (!clone.getAttribute("width")) {
    clone.setAttribute("width", `${width}`);
  }

  if (!clone.getAttribute("height")) {
    clone.setAttribute("height", `${height}`);
  }

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
}

function createShapeElement(type, rect, zIndex, patch = {}) {
  return {
    id: newId(),
    type,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    zIndex,
    opacity: patch.opacity ?? 1,
    locked: false,
    ...patch,
  };
}

function buildVisualElements(element, rootRect, zIndex) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  if (!isVisible(style, rect)) {
    return [];
  }

  if (
    element.dataset.canvasImageFrame === "true" &&
    element.querySelector('[data-canvas-image-inner="true"]')
  ) {
    return [];
  }

  const canvasRect = toCanvasRect(rect, rootRect);
  const opacity = parsePx(style.opacity, 1);
  const boxShadow = style.boxShadow !== "none" ? style.boxShadow : "none";

  if (element.tagName === "IMG" && element.currentSrc) {
    const frameElement =
      element.dataset.canvasImageInner === "true" && element.parentElement?.dataset.canvasImageFrame === "true"
        ? element.parentElement
        : null;
    const frameRect = frameElement ? frameElement.getBoundingClientRect() : rect;
    const frameStyle = frameElement ? window.getComputedStyle(frameElement) : style;
    const uniformBorder = getUniformBorder(frameStyle);
    const { x: objectPositionX, y: objectPositionY } = parseObjectPosition(
      element.style.objectPosition || style.objectPosition,
    );
    const imageScale = parseScaleTransform(element.style.transform || style.transform);
    const frameBoxShadow = frameStyle.boxShadow !== "none" ? frameStyle.boxShadow : "none";
    const effectiveOpacity = frameElement
      ? clamp(parsePx(frameStyle.opacity, 1) * parsePx(style.opacity, 1), 0, 1)
      : opacity;

    return [
      createShapeElement("image", toCanvasRect(frameRect, rootRect), zIndex, {
        borderColor: uniformBorder?.color ?? "transparent",
        borderRadius: parsePx(frameStyle.borderTopLeftRadius),
        borderWidth: uniformBorder?.width ?? 0,
        boxShadow: frameBoxShadow,
        imageScale,
        objectFit: style.objectFit || "cover",
        objectPositionX,
        objectPositionY,
        opacity: effectiveOpacity,
        src: element.currentSrc,
      }),
    ];
  }

  if (element.tagName === "SVG") {
    return [
      createShapeElement("image", canvasRect, zIndex, {
        borderColor: "transparent",
        borderRadius: parsePx(style.borderTopLeftRadius),
        borderWidth: 0,
        boxShadow,
        objectFit: "fill",
        opacity,
        src: serializeSvg(element),
      }),
    ];
  }

  const backgroundColor = !isTransparentColor(style.backgroundColor) ? style.backgroundColor : "transparent";
  const uniformBorder = getUniformBorder(style);
  const hasVisualSurface =
    backgroundColor !== "transparent" ||
    boxShadow !== "none" ||
    Boolean(uniformBorder) ||
    getBorderSegments(style, canvasRect).length > 0;

  if (!hasVisualSurface) {
    return [];
  }

  const shapeType = isLineShape(canvasRect)
    ? "line"
    : isEllipseShape(style, canvasRect)
      ? "ellipse"
      : "rect";

  const elements = [];

  if (shapeType === "line") {
    elements.push(
      createShapeElement("line", canvasRect, zIndex, {
        boxShadow,
        color: backgroundColor !== "transparent" ? backgroundColor : uniformBorder?.color ?? "#000000",
        opacity,
      }),
    );
  } else {
    elements.push(
      createShapeElement(shapeType, canvasRect, zIndex, {
        borderColor: uniformBorder?.color ?? "transparent",
        borderRadius: parsePx(style.borderTopLeftRadius),
        borderWidth: uniformBorder?.width ?? 0,
        boxShadow,
        color: backgroundColor,
        opacity,
      }),
    );
  }

  if (!uniformBorder) {
    getBorderSegments(style, canvasRect).forEach((segment, index) => {
      const segmentType = isLineShape(segment) ? "line" : "rect";

      elements.push(
        createShapeElement(segmentType, segment, zIndex + index + 1, {
          boxShadow: "none",
          color: segment.color,
          opacity,
        }),
      );
    });
  }

  return elements;
}

function buildTextElement(element, rootRect, zIndex) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  if (!isVisible(style, rect) || !shouldCaptureText(element, style)) {
    return null;
  }

  const content = normalizeText(
    applyTextTransform(element.innerText || element.textContent, style.textTransform),
  );

  if (!content) {
    return null;
  }

  const fontSize = Math.max(8, Math.round(parsePx(style.fontSize, 12) * 100) / 100);

  return createShapeElement("text", toCanvasRect(rect, rootRect), zIndex, {
    bgColor: "transparent",
    color: style.color || "#111827",
    content,
    fontFamily: style.fontFamily || "'DM Sans',sans-serif",
    fontSize,
    fontStyle: style.fontStyle || "normal",
    fontWeight: `${style.fontWeight || "400"}`,
    letterSpacing: style.letterSpacing && style.letterSpacing !== "normal" ? style.letterSpacing : "normal",
    lineHeight: parseLineHeight(style, fontSize),
    textAlign: style.textAlign || "left",
    textDecoration: style.textDecorationLine === "none" ? "none" : style.textDecorationLine,
  });
}

export function buildCanvasElementsFromTemplate(rootElement) {
  if (!rootElement) {
    return cloneCanvasElements(SPLIT_TEMPLATE());
  }

  const rootRect = rootElement.getBoundingClientRect();
  const domElements = [rootElement, ...rootElement.querySelectorAll("*")];
  const canvasElements = [];
  let zIndex = 0;

  domElements.forEach(element => {
    const svgAncestor = element.closest("svg");

    if (element !== rootElement && svgAncestor && svgAncestor !== element) {
      return;
    }

    const visualElements = buildVisualElements(element, rootRect, zIndex);

    visualElements.forEach(item => {
      zIndex += 1;
      canvasElements.push({ ...item, zIndex });
    });

    const textElement = buildTextElement(element, rootRect, zIndex + 1);

    if (textElement) {
      zIndex += 1;
      canvasElements.push({ ...textElement, zIndex });
    }
  });

  return canvasElements.length ? canvasElements : cloneCanvasElements(SPLIT_TEMPLATE());
}

export async function transferTemplateToCanvas(rootElement) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitForPaint();

  const elements = buildCanvasElementsFromTemplate(rootElement);
  const clonedElements = cloneCanvasElements(elements);

  try {
    await Promise.all([
      setStoredValue(STORAGE_KEYS.canvasElements, clonedElements),
      setStoredValue(STORAGE_KEYS.canvasTemplateSeed, clonedElements),
    ]);
  } catch (error) {
    console.warn("Unable to persist transferred canvas elements.", error);
  }

  return clonedElements;
}
