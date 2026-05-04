import { SNAP_SIZE } from "./canvasEditor.constants.js";

const MIN_RESIZE_WIDTH = 20;
const MIN_RESIZE_HEIGHT = 6;

export function snapValue(value, enabled) {
  return enabled ? Math.round(value / SNAP_SIZE) * SNAP_SIZE : value;
}

export function applyResize(handle, { x, y, width: widthValue, height: heightValue }, dx, dy) {
  const clampW = delta => Math.max(MIN_RESIZE_WIDTH, widthValue + delta);
  const clampH = delta => Math.max(MIN_RESIZE_HEIGHT, heightValue + delta);

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
