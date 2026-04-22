import { CanvasEditor } from "../components/CanvasEditor.jsx";
import { STORAGE_KEYS } from "../config/storageKeys.js";
import { useAutosave } from "../context/AutosaveContext.jsx";
import { SPLIT_TEMPLATE } from "../hooks/useCanvasEditor.js";
import { usePersistentState } from "../hooks/usePersistentState.js";
import styles from "../styles/PageShell.module.scss";

export default function CanvasPage() {
  const { notifyAutosave } = useAutosave();
  const [templateSeed] = usePersistentState(
    STORAGE_KEYS.canvasTemplateSeed,
    () => SPLIT_TEMPLATE(),
    notifyAutosave,
  );
  const [elements, setElements] = usePersistentState(
    STORAGE_KEYS.canvasElements,
    () => SPLIT_TEMPLATE(),
    notifyAutosave,
  );
  const [scale, setScale] = usePersistentState(STORAGE_KEYS.canvasScale, 0.75, notifyAutosave);
  const [snapOn, setSnapOn] = usePersistentState(STORAGE_KEYS.canvasSnap, true, notifyAutosave);

  return (
    <div className={`${styles.shell} ${styles.shellWide}`}>
      <CanvasEditor
        elements={elements}
        scale={scale}
        setElements={setElements}
        setScale={setScale}
        setSnapOn={setSnapOn}
        snapOn={snapOn}
        templateSeed={templateSeed}
      />
    </div>
  );
}
