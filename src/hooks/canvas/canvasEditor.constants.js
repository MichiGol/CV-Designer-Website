import { A4_HEIGHT_PX, A4_WIDTH_PX } from "../../config/pageSizes.js";

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

export const TYPE_DEFAULTS = {
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
