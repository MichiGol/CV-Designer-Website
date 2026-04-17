import { useEffect, useRef, useState } from "react";
import { getElementTypeMeta } from "../config/layoutConfig.js";
import { A4_H, A4_W, RESIZE_HANDLES, SNAP_SIZE, useCanvasEditor } from "../hooks/useCanvasEditor.js";
import { COLOR, FONT_EDITOR, propPanelInput } from "../styles/tokens.js";

const CSS_PIXELS_PER_INCH = 96;
const PDF_TARGET_DPI = 300;
const PDF_EXPORT_SCALE = PDF_TARGET_DPI / CSS_PIXELS_PER_INCH;

const noop = () => {};
const waitForPaint = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

function getExportRenderScale() {
  const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const targetWidth = Math.ceil((A4_W * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;
  const targetHeight = Math.ceil((A4_H * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;

  return Math.max(targetWidth / A4_W, targetHeight / A4_H);
}

function buildPdfImageCanvas(sourceCanvas) {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = sourceCanvas.width;
  outputCanvas.height = sourceCanvas.height;

  const context = outputCanvas.getContext("2d", { alpha: false });

  if (!context) {
    return sourceCanvas;
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
  context.imageSmoothingEnabled = false;

  if ("imageSmoothingQuality" in context) {
    context.imageSmoothingQuality = "high";
  }

  context.drawImage(sourceCanvas, 0, 0);

  return outputCanvas;
}

async function waitForImages(root) {
  const images = Array.from(root.querySelectorAll("img"));

  await Promise.all(
    images.map(image => {
      if (image.complete) {
        return Promise.resolve();
      }

      return new Promise(resolve => {
        const done = () => resolve();
        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", done, { once: true });
      });
    }),
  );
}

function ResizeHandles({ el, onHandleDown }) {
  const size = 8;

  return RESIZE_HANDLES.map(handle => (
    <div
      key={handle.id}
      onMouseDown={event => {
        event.stopPropagation();
        onHandleDown(event, handle.id);
      }}
      style={{ position: "absolute", left: handle.cx * el.width - size / 2, top: handle.cy * el.height - size / 2, width: size, height: size, background: "white", border: "1.5px solid #2563eb", borderRadius: ["n", "s", "e", "w"].includes(handle.id) ? "50%" : 2, cursor: handle.cur, zIndex: 99998, boxShadow: "0 1px 4px rgba(0,0,0,0.25)", pointerEvents: "all" }}
    />
  ));
}

function FloatingContextBar({ el, scale, onDelete, onDuplicate, onZChange, onLock }) {
  const top = Math.max(0, el.y * scale - 40);
  const left = el.x * scale;
  const button = (icon, onClick, title, danger = false) => <button onClick={onClick} style={{ background: "none", border: "none", color: danger ? COLOR.danger : COLOR.textSecondary, cursor: "pointer", padding: "4px 7px", fontSize: 13, borderRadius: 4, fontFamily: FONT_EDITOR, lineHeight: 1 }} title={title}>{icon}</button>;

  return (
    <div style={{ position: "absolute", top, left, zIndex: 99999, pointerEvents: "all" }}>
      <div style={{ display: "flex", alignItems: "center", background: COLOR.bgPanel, border: `1px solid ${COLOR.borderMid}`, borderRadius: 8, padding: "2px 3px", gap: 1, boxShadow: "0 6px 24px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>
        {button("⬆", () => onZChange("up"), "Ebene vorwärts")}
        {button("⬇", () => onZChange("down"), "Ebene rückwärts")}
        {button("⤒", () => onZChange("front"), "Ganz nach vorne")}
        {button("⤓", () => onZChange("back"), "Ganz nach hinten")}
        <div style={{ width: 1, background: COLOR.border, margin: "4px 1px", alignSelf: "stretch" }} />
        {button("⧉", onDuplicate, "Duplizieren (Strg+D)")}
        {button(el.locked ? "🔒" : "🔓", onLock, el.locked ? "Entsperren" : "Sperren")}
        <div style={{ width: 1, background: COLOR.border, margin: "4px 1px", alignSelf: "stretch" }} />
        {button("✕", onDelete, "Löschen (Entf)", true)}
      </div>

    </div>
  );
}

function CanvasElement({ el, selected, editing, onBodyDown, onHandleDown, onDblClick, onTextChange, onStopEditing }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  const ring = selected ? { outline: "2px solid #2563eb", outlineOffset: 1 } : {};
  const base = { position: "absolute", left: el.x, top: el.y, width: el.width, height: el.height, zIndex: el.zIndex, opacity: el.opacity, boxSizing: "border-box", ...ring };
  const onMouseDown = event => {
    if (event.button !== 0 || editing) {
      return;
    }
    event.stopPropagation();
    onBodyDown(event);
  };

  if (el.type === "text") {
    const textStyle = { fontSize: el.fontSize, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textDecoration: el.textDecoration, fontFamily: el.fontFamily, color: el.color, textAlign: el.textAlign, lineHeight: el.lineHeight, letterSpacing: el.letterSpacing || "normal", whiteSpace: "pre-wrap", wordBreak: "break-word" };

    return (
      <div onDoubleClick={event => { event.stopPropagation(); if (!el.locked) onDblClick(); }} onMouseDown={onMouseDown} style={{ ...base, background: el.bgColor, cursor: el.locked ? "not-allowed" : editing ? "text" : selected ? "move" : "pointer", overflow: "visible" }}>
        {editing ? <textarea defaultValue={el.content} onBlur={onStopEditing} onChange={event => onTextChange(event.target.value)} onKeyDown={event => { if (event.key === "Escape") onStopEditing(); event.stopPropagation(); }} ref={textareaRef} style={{ ...textStyle, width: "100%", height: "100%", background: el.bgColor === "transparent" ? "rgba(37,99,235,0.06)" : el.bgColor, border: "none", outline: "none", resize: "none", padding: 0, margin: 0, boxSizing: "border-box" }} /> : <div style={{ ...textStyle, width: "100%", height: "100%", overflow: "hidden" }}>{el.content}</div>}
        {selected && !editing && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null}
      </div>
    );
  }

  const sharedStyle = { ...base, background: el.color, boxShadow: el.boxShadow || "none", cursor: el.locked ? "not-allowed" : selected ? "move" : "pointer" };
  const child = selected && !el.locked ? <ResizeHandles el={el} onHandleDown={onHandleDown} /> : null;

  if (el.type === "rect") return <div onMouseDown={onMouseDown} style={{ ...sharedStyle, borderRadius: el.borderRadius, border: el.borderWidth > 0 ? `${el.borderWidth}px solid ${el.borderColor}` : "none" }}>{child}</div>;
  if (el.type === "ellipse") return <div onMouseDown={onMouseDown} style={{ ...sharedStyle, borderRadius: "50%", border: el.borderWidth > 0 ? `${el.borderWidth}px solid ${el.borderColor}` : "none" }}>{child}</div>;
  if (el.type === "line") return <div onMouseDown={onMouseDown} style={sharedStyle}>{child}</div>;
  if (el.type === "image") {
    return (
      <div onMouseDown={onMouseDown} style={{ ...base, cursor: el.locked ? "not-allowed" : selected ? "move" : "pointer", overflow: "visible" }}>
        <img alt="" draggable={false} src={el.src} style={{ width: "100%", height: "100%", display: "block", objectFit: el.objectFit || "cover", borderRadius: el.borderRadius || 0, border: el.borderWidth > 0 ? `${el.borderWidth}px solid ${el.borderColor}` : "none", boxShadow: el.boxShadow || "none", pointerEvents: "none", userSelect: "none" }} />
        {child}
      </div>
    );
  }
  return null;
}

function LayersPanel({ elements, selectedId, layerNames, onSelect }) {
  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div style={{ width: 198, background: COLOR.bgPanel, borderRight: `1px solid ${COLOR.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "10px 14px 8px", borderBottom: `1px solid ${COLOR.border}` }}><span style={{ fontSize: 9, fontWeight: 700, color: COLOR.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FONT_EDITOR }}>Ebenen</span></div>
      <div className="cv-scroll" style={{ flex: 1, overflowY: "auto" }}>
        {sorted.map(el => {
          const active = el.id === selectedId;
          const meta = getElementTypeMeta(el.type);

          return (
            <div key={el.id} onClick={() => onSelect(el.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: active ? COLOR.bgSurface : "transparent", borderLeft: active ? "2px solid #2563eb" : "2px solid transparent", cursor: "pointer", userSelect: "none" }}>
              <span style={{ fontSize: 10, color: active ? COLOR.blue : COLOR.textMuted, width: 14, textAlign: "center", fontFamily: FONT_EDITOR, flexShrink: 0 }}>{meta.icon}</span>
              <span style={{ fontSize: 10, color: active ? COLOR.textPrimary : COLOR.textSecondary, fontFamily: FONT_EDITOR, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{layerNames.get(el.id) ?? meta.label}</span>
              <span style={{ fontSize: 9, color: COLOR.textMuted, fontFamily: FONT_EDITOR }}>{el.zIndex}</span>
              {el.locked ? <span style={{ fontSize: 9 }}>🔒</span> : null}
            </div>
          );
        })}
      </div>

    </div>
  );
}

function toColorInputValue(color) {
  if (typeof color !== "string") {
    return "#ffffff";
  }

  const trimmed = color.trim();

  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) {
    return trimmed.length === 9 ? trimmed.slice(0, 7) : trimmed;
  }

  const rgbMatch = trimmed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);

  if (!rgbMatch) {
    return "#ffffff";
  }

  return `#${rgbMatch
    .slice(1, 4)
    .map(value => Number(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function PropertiesPanel({ el, onUpdate, onDelete, onDuplicate, onZChange, snapOn, onSnapToggle }) {
  const shell = { width: 288, minWidth: 288, background: COLOR.bgPanel, borderLeft: `1px solid ${COLOR.border}`, display: "flex", flexDirection: "column", flexShrink: 0 };
  const sectionLabel = text => <div style={{ fontSize: 9, fontWeight: 700, color: COLOR.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: FONT_EDITOR }}>{text}</div>;
  const fieldLabel = text => <div style={{ fontSize: 9, color: COLOR.textMuted, fontFamily: FONT_EDITOR, marginBottom: 4 }}>{text}</div>;
  const numberInput = (value, key, min, max, step = 1) => <input max={max} min={min} onChange={event => onUpdate({ [key]: Number(event.target.value) })} step={step} style={propPanelInput} type="number" value={typeof value === "number" ? (step < 1 ? Math.round(value * 100) / 100 : Math.round(value)) : value} />;
  const colorInput = (value, key) => <div style={{ display: "flex", gap: 6, alignItems: "center" }}><input onChange={event => onUpdate({ [key]: event.target.value })} style={{ width: 34, height: 30, border: `1px solid ${COLOR.border}`, borderRadius: 8, cursor: "pointer", padding: 2, background: "none" }} type="color" value={!value || value === "transparent" ? "#ffffff" : toColorInputValue(value)} /><input onChange={event => onUpdate({ [key]: event.target.value })} style={{ ...propPanelInput, flex: 1 }} type="text" value={value || "transparent"} /></div>;

  if (!el) {
    return (
      <div style={shell}>
        <div style={{ padding: "14px 16px 13px", borderBottom: `1px solid ${COLOR.border}`, background: "linear-gradient(180deg,#111827 0%,#0d1117 100%)" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: COLOR.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: FONT_EDITOR, marginBottom: 5 }}>Eigenschaften</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.textPrimary, fontFamily: FONT_EDITOR }}>Kein Element ausgewählt</div>
        </div>
        <div style={{ padding: 14 }}>
          {sectionLabel("Arbeitsfläche")}
          <button aria-pressed={snapOn} onClick={onSnapToggle} style={{ width: "100%", padding: "11px 12px", fontFamily: FONT_EDITOR, fontSize: 13, fontWeight: 700, border: `1px solid ${snapOn ? "#2563eb" : COLOR.borderMid}`, borderRadius: 12, cursor: "pointer", background: snapOn ? "linear-gradient(180deg,#1d4ed81f 0%,#2563eb26 100%)" : "#121821", color: snapOn ? "#dbeafe" : "#c5d4e8" }}>{snapOn ? "Raster aktiv" : "Raster inaktiv"}</button>
        </div>
      </div>
    );
  }

  const meta = getElementTypeMeta(el.type);

  return (
    <div className="cv-scroll" style={{ ...shell, overflowY: "auto" }}>
      <div style={{ padding: "14px 16px 13px", borderBottom: `1px solid ${COLOR.border}`, background: "linear-gradient(180deg,#111827 0%,#0d1117 100%)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: COLOR.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: FONT_EDITOR, marginBottom: 5 }}>Eigenschaften</div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.textPrimary, fontFamily: FONT_EDITOR }}>{meta.label}</div>
          <div style={{ fontSize: 10, color: COLOR.textSecondary, fontFamily: FONT_EDITOR, padding: "4px 8px", border: `1px solid ${COLOR.border}`, borderRadius: 999, background: "#11161f" }}>Ebene {el.zIndex}</div>
        </div>
      </div>

      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${COLOR.border}` }}>
        {sectionLabel("Position & Größe")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}><div>{fieldLabel("X")}{numberInput(el.x, "x", -A4_W, A4_W)}</div><div>{fieldLabel("Y")}{numberInput(el.y, "y", -A4_H, A4_H)}</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}><div>{fieldLabel("Breite")}{numberInput(el.width, "width", 10, A4_W)}</div><div>{fieldLabel("Höhe")}{numberInput(el.height, "height", 4, A4_H)}</div></div>
        {fieldLabel("Deckkraft")}
        <input max={1} min={0} onChange={event => onUpdate({ opacity: Number(event.target.value) })} step={0.01} style={{ width: "100%", accentColor: "#2563eb" }} type="range" value={el.opacity} />
      </div>

      {el.type === "text" ? <div style={{ padding: "12px 14px", borderBottom: `1px solid ${COLOR.border}` }}>{sectionLabel("Typografie")}<div style={{ marginBottom: 8 }}>{fieldLabel("Schriftart")}<select onChange={event => onUpdate({ fontFamily: event.target.value })} style={propPanelInput} value={el.fontFamily}><option value="'DM Sans',sans-serif">DM Sans</option><option value="'Cormorant Garamond',Georgia,serif">Cormorant</option><option value="'EB Garamond',Georgia,serif">EB Garamond</option><option value="'Lato',sans-serif">Lato</option><option value="'Bebas Neue',sans-serif">Bebas Neue</option><option value="Georgia,serif">Georgia</option><option value="'Courier New',monospace">Courier New</option></select></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}><div>{fieldLabel("Größe")}{numberInput(el.fontSize, "fontSize", 6, 120)}</div><div>{fieldLabel("Zeilenabstand")}{numberInput(el.lineHeight, "lineHeight", 1, 3, 0.05)}</div></div><div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}><button onClick={() => onUpdate({ fontWeight: el.fontWeight === "700" ? "400" : "700" })} style={{ ...propPanelInput, width: "auto", paddingInline: 10 }}>B</button><button onClick={() => onUpdate({ fontStyle: el.fontStyle === "italic" ? "normal" : "italic" })} style={{ ...propPanelInput, width: "auto", paddingInline: 10 }}>I</button><button onClick={() => onUpdate({ textDecoration: el.textDecoration === "underline" ? "none" : "underline" })} style={{ ...propPanelInput, width: "auto", paddingInline: 10 }}>U</button><div style={{ flex: 1 }} />{["left", "center", "right"].map(align => <button key={align} onClick={() => onUpdate({ textAlign: align })} style={{ ...propPanelInput, width: "auto", paddingInline: 10 }}>{align === "left" ? "L" : align === "center" ? "Z" : "R"}</button>)}</div>{fieldLabel("Textfarbe")}<div style={{ marginBottom: 8 }}>{colorInput(el.color, "color")}</div>{fieldLabel("Hintergrund")}<button onClick={() => onUpdate({ bgColor: "transparent" })} style={{ ...propPanelInput, width: "auto", paddingInline: 10, marginBottom: 6 }}>Transparent</button>{colorInput(el.bgColor === "transparent" ? "#ffffff" : el.bgColor, "bgColor")}</div> : null}

      {["rect", "ellipse", "line"].includes(el.type) ? <div style={{ padding: "12px 14px", borderBottom: `1px solid ${COLOR.border}` }}>{sectionLabel("Aussehen")}{fieldLabel("Füllfarbe")}<div style={{ marginBottom: 8 }}>{colorInput(el.color, "color")}</div>{el.type !== "line" ? <><div>{fieldLabel("Rahmenfarbe")}{colorInput(el.borderColor || "transparent", "borderColor")}</div><div style={{ marginTop: 8 }}>{fieldLabel("Rahmenstärke")}{numberInput(el.borderWidth || 0, "borderWidth", 0, 20)}</div></> : null}{el.type === "rect" ? <div style={{ marginTop: 8 }}>{fieldLabel("Eckenradius")}{numberInput(el.borderRadius || 0, "borderRadius", 0, 200)}</div> : null}</div> : null}

      {el.type === "image" ? <div style={{ padding: "12px 14px", borderBottom: `1px solid ${COLOR.border}` }}>{sectionLabel("Bild")}{fieldLabel("Rahmenfarbe")}<div style={{ marginBottom: 8 }}>{colorInput(el.borderColor || "transparent", "borderColor")}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}><div>{fieldLabel("Rahmenstärke")}{numberInput(el.borderWidth || 0, "borderWidth", 0, 20)}</div><div>{fieldLabel("Radius")}{numberInput(el.borderRadius || 0, "borderRadius", 0, 200)}</div></div><div>{fieldLabel("Anpassung")}<select onChange={event => onUpdate({ objectFit: event.target.value })} style={propPanelInput} value={el.objectFit || "cover"}><option value="cover">Cover</option><option value="contain">Contain</option><option value="fill">Fill</option></select></div></div> : null}

      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${COLOR.border}` }}>
        {sectionLabel("Ebenenreihenfolge")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
          {[["Nach vorne", "up"], ["Nach hinten", "down"], ["Ganz nach vorne", "front"], ["Ganz nach hinten", "back"]].map(([label, direction]) => <button key={direction} onClick={() => onZChange(direction)} style={propPanelInput}>{label}</button>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <button onClick={onDuplicate} style={propPanelInput}>Duplizieren</button>
          <button onClick={onDelete} style={{ ...propPanelInput, color: COLOR.danger, borderColor: COLOR.dangerBorder, background: COLOR.dangerBg }}>Löschen</button>
        </div>
      </div>
    </div>
  );
}

export function CanvasEditor({ elements: propElements, setElements: propSetElements, templateSeed: propTemplateSeed, scale: propScale, setScale: propSetScale, snapOn: propSnapOn, setSnapOn: propSetSnapOn }) {
  const { elements, scale, snapOn, selectedEl, editingId, isDragging, layerNames, selectedMeta, setElements, setScale, setSnapOn, setSelectedId, setEditingId, updateEl, addElement, deleteEl, duplicateEl, changeZOrder, resetToTemplate, clearSelection, selectElement, handleMouseMove, handleMouseUp, handleBodyMouseDown, handleResizeHandleMouseDown, canvasRef } = useCanvasEditor({ elements: propElements, setElements: propSetElements, templateElements: propTemplateSeed, scale: propScale, setScale: propSetScale, snapOn: propSnapOn, setSnapOn: propSetSnapOn });
  const [isExporting, setIsExporting] = useState(false);
  const exportPageRef = useRef(null);

  const displayW = A4_W * scale;
  const displayH = A4_H * scale;
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  const toolButton = (label, onClick) => <button onClick={onClick} style={{ padding: "5px 9px", background: "none", border: "1px solid transparent", borderRadius: 6, color: COLOR.textSecondary, cursor: "pointer", fontSize: 11, fontFamily: FONT_EDITOR, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</button>;

  const exportPDF = async () => {
    if (!exportPageRef.current || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await waitForImages(exportPageRef.current);
      await waitForPaint();

      const renderScale = getExportRenderScale();
      const canvas = await html2canvas(exportPageRef.current, {
        backgroundColor: window.getComputedStyle(exportPageRef.current).backgroundColor || "#ffffff",
        height: A4_H,
        logging: false,
        scale: renderScale,
        useCORS: true,
        width: A4_W,
        windowHeight: A4_H,
        windowWidth: A4_W,
      });

      const pdfImageCanvas = buildPdfImageCanvas(canvas);
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageData = pdfImageCanvas.toDataURL("image/png", 1.0);

      pdf.addImage(imageData, "PNG", 0, 0, pageWidth, pageHeight, undefined, "NONE");
      pdf.save("lebenslauf-freiform.pdf");
    } catch (error) {
      console.error("Canvas PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ display: "flex", flexDirection: "column", width: "100vw", maxWidth: "100vw", minWidth: 0, height: "100%", fontFamily: FONT_EDITOR, overflow: "hidden", userSelect: isDragging ? "none" : "auto" }}>
      <div style={{ minHeight: 46, background: COLOR.bgApp, borderBottom: `1px solid ${COLOR.border}`, display: "flex", alignItems: "center", padding: "6px 12px", gap: 2, flexShrink: 0, flexWrap: "wrap" }}>
        {toolButton("T Textfeld", () => addElement("text"))}
        {toolButton("▭ Rechteck", () => addElement("rect"))}
        {toolButton("○ Kreis", () => addElement("ellipse"))}
        {toolButton("― Linie", () => addElement("line"))}
        <div style={{ width: 1, height: 18, background: COLOR.border, margin: "0 4px" }} />
        <button onClick={resetToTemplate} style={{ ...propPanelInput, width: "auto", paddingInline: 10 }}>⊞ Vorlage zurücksetzen</button>
        <div style={{ width: 1, height: 18, background: COLOR.border, margin: "0 4px" }} />
        <button aria-pressed={snapOn} onClick={() => setSnapOn(current => !current)} style={{ padding: "6px 11px", background: snapOn ? "linear-gradient(180deg,#1d4ed82c 0%,#2563eb40 100%)" : "#11161f", border: `1px solid ${snapOn ? "#60a5fa" : COLOR.borderMid}`, borderRadius: 999, color: snapOn ? "#dbeafe" : COLOR.textSecondary, cursor: "pointer", fontSize: 11, fontFamily: FONT_EDITOR, fontWeight: 700 }}>{snapOn ? "Raster aktiv" : "Raster aus"}</button>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 10, color: COLOR.textMuted, fontFamily: FONT_EDITOR }}>Zoom</span>
          <input max={1.2} min={0.35} onChange={event => setScale(Number(event.target.value))} step={0.05} style={{ width: 72, accentColor: "#2563eb" }} type="range" value={scale} />
          <span style={{ fontSize: 10, color: COLOR.textSecondary, fontFamily: FONT_EDITOR, width: 32 }}>{Math.round(scale * 100)}%</span>
        </div>
        <div style={{ width: 8 }} />
        <button disabled={isExporting} onClick={exportPDF} style={{ padding: "6px 14px", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none", borderRadius: 7, color: "white", cursor: isExporting ? "progress" : "pointer", fontSize: 11, fontWeight: 700, fontFamily: FONT_EDITOR, boxShadow: "0 4px 14px rgba(37,99,235,0.4)", opacity: isExporting ? 0.8 : 1 }}>{isExporting ? "Exportiert..." : "↓ PDF"}</button>
      </div>

      <div aria-hidden="true" style={{ position: "fixed", left: -10000, top: 0, width: A4_W, height: A4_H, pointerEvents: "none", zIndex: -1 }}>
        <div ref={exportPageRef} style={{ width: A4_W, height: A4_H, background: "#ffffff", overflow: "hidden" }}>
          {sortedElements.map(el => <CanvasElement key={el.id} editing={false} el={el} onBodyDown={noop} onDblClick={noop} onHandleDown={noop} onStopEditing={noop} onTextChange={noop} selected={false} />)}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", width: "100%", minWidth: 0 }}>
        <LayersPanel elements={elements} layerNames={layerNames} onSelect={selectElement} selectedId={selectedEl?.id} />
        <div className="cv-scroll" style={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "auto", background: COLOR.bgCanvas, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "24px 28px" }}>
          <div style={{ position: "relative", width: displayW, height: displayH, flexShrink: 0, margin: "0 auto" }}>
            {/* The outer box is scaled for display, but the working canvas still uses real A4 coordinates. */}
            <div onMouseDown={event => { if (event.target === canvasRef.current) clearSelection(); }} ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: A4_W, height: A4_H, background: "white", transformOrigin: "top left", transform: `scale(${scale})`, boxShadow: "0 24px 80px rgba(0,0,0,0.65)", borderRadius: 2, overflow: "hidden" }}>
              {snapOn ? <div style={{ position: "absolute", inset: 0, zIndex: 99990, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(37,99,235,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.06) 1px,transparent 1px)", backgroundSize: `${SNAP_SIZE}px ${SNAP_SIZE}px` }} /> : null}
              {sortedElements.map(el => <CanvasElement key={el.id} editing={editingId === el.id} el={el} onBodyDown={event => handleBodyMouseDown(event, el.id)} onDblClick={() => { if (el.type === "text") { setSelectedId(el.id); setEditingId(el.id); } }} onHandleDown={(event, handle) => handleResizeHandleMouseDown(event, el.id, handle)} onStopEditing={() => setEditingId(null)} onTextChange={value => updateEl(el.id, { content: value })} selected={selectedEl?.id === el.id} />)}
            </div>
            {selectedEl && !editingId ? <FloatingContextBar el={selectedEl} onDelete={() => deleteEl(selectedEl.id)} onDuplicate={() => duplicateEl(selectedEl.id)} onLock={() => updateEl(selectedEl.id, { locked: !selectedEl.locked })} onZChange={direction => changeZOrder(selectedEl.id, direction)} scale={scale} /> : null}
          </div>
        </div>
        <PropertiesPanel el={selectedEl} onDelete={() => selectedEl && deleteEl(selectedEl.id)} onDuplicate={() => selectedEl && duplicateEl(selectedEl.id)} onSnapToggle={() => setSnapOn(current => !current)} onUpdate={patch => selectedEl && updateEl(selectedEl.id, patch)} onZChange={direction => selectedEl && changeZOrder(selectedEl.id, direction)} snapOn={snapOn} />
      </div>

      <div className="cv-scroll" style={{ height: 24, background: COLOR.bgApp, borderTop: `1px solid ${COLOR.border}`, display: "flex", alignItems: "center", padding: "0 14px", overflowX: "auto" }}>
        {[`${elements.length} Elemente`, selectedEl ? `Ausgewählt: ${selectedMeta?.label ?? "Element"} @ ${Math.round(selectedEl.x)}, ${Math.round(selectedEl.y)}` : "Kein Element ausgewählt", `A4 · 794×1123 · ${Math.round(scale * 100)}%`, "Doppelklick = Bearbeiten · Entf = Löschen · Pfeiltasten = Bewegen · Strg+D = Duplizieren"].map((text, index) => <span key={index} style={{ fontSize: 9, color: index === 1 ? COLOR.textSecondary : "#303840", fontFamily: FONT_EDITOR, whiteSpace: "nowrap" }}>{index > 0 ? <span style={{ margin: "0 12px", color: COLOR.border }}>|</span> : null}{text}</span>)}
      </div>
    </div>
  );
}
