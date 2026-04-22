import { memo, useCallback, useRef, useState } from "react";
import cx from "clsx";

import { A4_HEIGHT_PT, A4_WIDTH_PT, CSS_PIXELS_PER_INCH } from "../config/pageSizes.js";
import { A4_H, A4_W, SNAP_SIZE, useCanvasEditor } from "../hooks/useCanvasEditor.js";
import { CanvasElement } from "./CanvasElement.jsx";
import { FloatingContextBar, LayersPanel } from "./LayersAndContextBar.jsx";
import { PropertiesPanel } from "./PropertiesPanel.jsx";

import styles from "./CanvasEditor.module.scss";

const PDF_TARGET_DPI = 300;
const PDF_EXPORT_SCALE = PDF_TARGET_DPI / CSS_PIXELS_PER_INCH;
const STATUS_HINTS = "Doppelklick = Bearbeiten | Entf = Loeschen | Pfeiltasten = Bewegen | Strg+D = Duplizieren";

const waitForPaint = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

function getRenderScale() {
  const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const targetWidth = Math.ceil((A4_W * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;
  const targetHeight = Math.ceil((A4_H * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;

  return Math.max(targetWidth / A4_W, targetHeight / A4_H);
}

function getExportCaptureSize(root) {
  const rect = root.getBoundingClientRect();

  return {
    height: Math.round(rect.height) || A4_H,
    width: Math.round(rect.width) || A4_W,
  };
}

function buildPdfCanvas(sourceCanvas) {
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
        return image.decode?.().catch(() => {}) ?? Promise.resolve();
      }

      return new Promise(resolve => {
        const handleReady = () => {
          const decodePromise = image.decode?.().catch(() => {});

          if (decodePromise) {
            decodePromise.finally(resolve);
            return;
          }

          resolve();
        };

        image.addEventListener("load", handleReady, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }),
  );
}

const ToolButton = memo(function ToolButton({ label, onClick }) {
  return (
    <button className={styles.toolbar__btn} type="button" onClick={onClick}>
      {label}
    </button>
  );
});

function Toolbar({
  snapOn,
  scale,
  isExporting,
  onAddElement,
  onResetTemplate,
  onToggleSnap,
  onScaleChange,
  onExport,
}) {
  return (
    <div className={styles.toolbar}>
      <ToolButton label="T Textfeld" onClick={() => onAddElement("text")} />
      <ToolButton label="[] Rechteck" onClick={() => onAddElement("rect")} />
      <ToolButton label="() Kreis" onClick={() => onAddElement("ellipse")} />
      <ToolButton label="-- Linie" onClick={() => onAddElement("line")} />

      <div className={styles.toolbar__sep} />

      <button className={cx(styles.input, styles.toolbar__resetBtn)} type="button" onClick={onResetTemplate}>
        Vorlage zuruecksetzen
      </button>

      <div className={styles.toolbar__sep} />

      <button
        className={cx(
          styles.toolbar__snapBtn,
          snapOn ? styles["toolbar__snapBtn--on"] : styles["toolbar__snapBtn--off"],
        )}
        aria-pressed={snapOn}
        type="button"
        onClick={onToggleSnap}
      >
        {snapOn ? "Raster aktiv" : "Raster aus"}
      </button>

      <div className={styles.toolbar__spacer} />

      <div className={styles.toolbar__zoom}>
        <span className={styles.toolbar__zoomLabel}>Zoom</span>
        <input
          type="range"
          min={0.35}
          max={1.2}
          step={0.05}
          value={scale}
          onChange={event => onScaleChange(Number(event.target.value))}
        />
        <span className={styles.toolbar__zoomValue}>{Math.round(scale * 100)}%</span>
      </div>

      <div className={styles.toolbar__gap} />

      <button
        className={cx(styles.toolbar__exportBtn, {
          [styles["toolbar__exportBtn--exporting"]]: isExporting,
        })}
        disabled={isExporting}
        type="button"
        onClick={onExport}
      >
        {isExporting ? "Export..." : "PDF"}
      </button>
    </div>
  );
}

function StatusBar({ elements, selectedEl, selectedMeta, scale }) {
  const items = [
    `${elements.length} Elemente`,
    selectedEl
      ? `Ausgewaehlt: ${selectedMeta?.label ?? "Element"} @ ${Math.round(selectedEl.x)}, ${Math.round(selectedEl.y)}`
      : "Kein Element ausgewaehlt",
    `A4 | 794x1123 | ${Math.round(scale * 100)}%`,
    STATUS_HINTS,
  ];

  return (
    <div className={cx(styles.statusBar, "cv-scroll")}>
      {items.map((text, index) => (
        <span
          key={index}
          className={cx(styles.statusBar__item, {
            [styles["statusBar__item--highlight"]]: index === 1,
          })}
        >
          {index > 0 ? <span className={styles.statusBar__sep}>|</span> : null}
          {text}
        </span>
      ))}
    </div>
  );
}

export function CanvasEditor({
  elements: propElements,
  setElements: propSetElements,
  templateSeed: propTemplateSeed,
  scale: propScale,
  setScale: propSetScale,
  snapOn: propSnapOn,
  setSnapOn: propSetSnapOn,
}) {
  const {
    elements,
    scale,
    snapOn,
    selectedEl,
    editingId,
    isDragging,
    layerNames,
    selectedMeta,
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
  } = useCanvasEditor({
    elements: propElements,
    setElements: propSetElements,
    templateElements: propTemplateSeed,
    scale: propScale,
    setScale: propSetScale,
    snapOn: propSnapOn,
    setSnapOn: propSetSnapOn,
  });
  const [isExporting, setIsExporting] = useState(false);
  const exportPageRef = useRef(null);
  const actionRef = useRef(null);

  actionRef.current = {
    addElement,
    changeZOrder,
    clearSelection,
    deleteEl,
    duplicateEl,
    handleBodyMouseDown,
    handleResizeHandleMouseDown,
    resetToTemplate,
    selectedEl,
    setEditingId,
    setScale,
    setSelectedId,
    setSnapOn,
    updateEl,
  };

  const displayW = A4_W * scale;
  const displayH = A4_H * scale;
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  const handleAddElement = useCallback(type => {
    actionRef.current?.addElement(type);
  }, []);

  const handleResetTemplate = useCallback(() => {
    actionRef.current?.resetToTemplate();
  }, []);

  const handleToggleSnap = useCallback(() => {
    actionRef.current?.setSnapOn(current => !current);
  }, []);

  const handleScaleChange = useCallback(nextScale => {
    actionRef.current?.setScale(nextScale);
  }, []);

  const handleCanvasMouseDown = useCallback(
    event => {
      if (event.target === canvasRef.current) {
        actionRef.current?.clearSelection();
      }
    },
    [canvasRef],
  );

  const handleElementBodyDown = useCallback((event, id) => {
    actionRef.current?.handleBodyMouseDown(event, id);
  }, []);

  const handleElementResizeDown = useCallback((event, id, handle) => {
    actionRef.current?.handleResizeHandleMouseDown(event, id, handle);
  }, []);

  const handleElementDoubleClick = useCallback((id, type) => {
    if (type !== "text") {
      return;
    }

    actionRef.current?.setSelectedId(id);
    actionRef.current?.setEditingId(id);
  }, []);

  const handleElementTextChange = useCallback((id, value) => {
    actionRef.current?.updateEl(id, { content: value });
  }, []);

  const handleElementStopEditing = useCallback(() => {
    actionRef.current?.setEditingId(null);
  }, []);

  const handleSelectedUpdate = useCallback(patch => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.updateEl(currentSelected.id, patch);
    }
  }, []);

  const handleSelectedDelete = useCallback(() => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.deleteEl(currentSelected.id);
    }
  }, []);

  const handleSelectedDuplicate = useCallback(() => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.duplicateEl(currentSelected.id);
    }
  }, []);

  const handleSelectedLock = useCallback(() => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.updateEl(currentSelected.id, { locked: !currentSelected.locked });
    }
  }, []);

  const handleSelectedZChange = useCallback(direction => {
    const currentSelected = actionRef.current?.selectedEl;

    if (currentSelected) {
      actionRef.current?.changeZOrder(currentSelected.id, direction);
    }
  }, []);

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

      const { width: captureWidth, height: captureHeight } = getExportCaptureSize(exportPageRef.current);
      const canvas = await html2canvas(exportPageRef.current, {
        backgroundColor: window.getComputedStyle(exportPageRef.current).backgroundColor || "#ffffff",
        height: captureHeight,
        logging: false,
        scale: getRenderScale(),
        useCORS: true,
        width: captureWidth,
        windowHeight: captureHeight,
        windowWidth: captureWidth,
      });

      const pdfImageCanvas = buildPdfCanvas(canvas);
      const pdf = new jsPDF("p", "pt", "a4");

      pdf.addImage(
        pdfImageCanvas.toDataURL("image/png", 1.0),
        "PNG",
        0,
        0,
        A4_WIDTH_PT,
        A4_HEIGHT_PT,
        undefined,
        "NONE",
      );
      pdf.save("lebenslauf-freiform.pdf");
    } catch (error) {
      console.error("Canvas PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={cx(styles.editor, { [styles["editor--dragging"]]: isDragging })}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Toolbar
        snapOn={snapOn}
        scale={scale}
        isExporting={isExporting}
        onAddElement={handleAddElement}
        onResetTemplate={handleResetTemplate}
        onToggleSnap={handleToggleSnap}
        onScaleChange={handleScaleChange}
        onExport={exportPDF}
      />

      <div aria-hidden="true" className={styles.exportTarget}>
        <div ref={exportPageRef} className={styles.exportPage}>
          {sortedElements.map(el => (
            <CanvasElement key={el.id} el={el} interactive={false} />
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <LayersPanel
          elements={elements}
          selectedId={selectedEl?.id}
          layerNames={layerNames}
          onSelect={selectElement}
        />

        <div className={cx(styles.canvasArea, "cv-scroll")}>
          <div className={styles.canvasWrapper} style={{ width: displayW, height: displayH }}>
            <div
              ref={canvasRef}
              className={styles.canvasPage}
              style={{ width: A4_W, height: A4_H, transform: `scale(${scale})` }}
              onMouseDown={handleCanvasMouseDown}
            >
              {snapOn ? (
                <div
                  className={styles.canvasGrid}
                  style={{ backgroundSize: `${SNAP_SIZE}px ${SNAP_SIZE}px` }}
                />
              ) : null}

              {sortedElements.map(el => (
                <CanvasElement
                  key={el.id}
                  el={el}
                  selected={selectedEl?.id === el.id}
                  editing={editingId === el.id}
                  onBodyDown={handleElementBodyDown}
                  onHandleDown={handleElementResizeDown}
                  onDblClick={handleElementDoubleClick}
                  onTextChange={handleElementTextChange}
                  onStopEditing={handleElementStopEditing}
                />
              ))}
            </div>

            {selectedEl && !editingId ? (
              <FloatingContextBar
                el={selectedEl}
                scale={scale}
                onDelete={handleSelectedDelete}
                onDuplicate={handleSelectedDuplicate}
                onLock={handleSelectedLock}
                onZChange={handleSelectedZChange}
              />
            ) : null}
          </div>
        </div>

        <PropertiesPanel
          el={selectedEl}
          snapOn={snapOn}
          onUpdate={handleSelectedUpdate}
          onDelete={handleSelectedDelete}
          onDuplicate={handleSelectedDuplicate}
          onZChange={handleSelectedZChange}
          onSnapToggle={handleToggleSnap}
        />
      </div>

      <StatusBar
        elements={elements}
        selectedEl={selectedEl}
        selectedMeta={selectedMeta}
        scale={scale}
      />
    </div>
  );
}
