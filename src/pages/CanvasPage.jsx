import { useEffect } from "react";

import { CanvasEditor } from "../components/CanvasEditor.jsx";
import { STORAGE_KEYS } from "../config/storageKeys.js";
import { useAutosave } from "../context/AutosaveContext.jsx";
import { SPLIT_TEMPLATE } from "../hooks/useCanvasEditor.js";
import { usePersistentState } from "../hooks/usePersistentState.js";
import styles from "../styles/PageShell.module.scss";
import {
  DEFAULT_CANVAS_SCALE,
  DEFAULT_CANVAS_SNAP,
  PROJECT_RESET_EVENT,
} from "../utils/projectReset.js";

export default function CanvasPage() {
  const { notifyAutosave } = useAutosave();
  const [templateSeed, setTemplateSeed] = usePersistentState(
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

  useEffect(() => {
    function handleProjectReset(event) {
      const resetState = event.detail ?? {};
      const nextTemplateSeed = resetState.canvasTemplateSeed ?? SPLIT_TEMPLATE();
      const nextElements = resetState.canvasElements ?? nextTemplateSeed;

      setTemplateSeed(nextTemplateSeed);
      setElements(nextElements);
      setScale(resetState.canvasScale ?? DEFAULT_CANVAS_SCALE);
      setSnapOn(resetState.canvasSnap ?? DEFAULT_CANVAS_SNAP);
    }

    window.addEventListener(PROJECT_RESET_EVENT, handleProjectReset);

    return () => {
      window.removeEventListener(PROJECT_RESET_EVENT, handleProjectReset);
    };
  }, [setElements, setScale, setSnapOn, setTemplateSeed]);

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
