import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { TemplateEditor } from "../components/TemplateEditor.jsx";
import { TEMPLATE_LAYOUTS } from "../config/layoutConfig.js";
import { useAutosave } from "../context/AutosaveContext.jsx";
import { useTemplateDraftPersistence } from "../hooks/useTemplateDraftPersistence.js";
import { useTemplateEditorStore } from "../store/templateEditorStore.js";
import styles from "../styles/PageShell.module.scss";

export default function TemplatePage() {
  const [searchParams] = useSearchParams();
  const { notifyAutosave } = useAutosave();
  const isHydrated = useTemplateEditorStore(state => state.meta.isHydrated);
  const isHydrating = useTemplateEditorStore(state => state.meta.isHydrating);
  const initialize = useTemplateEditorStore(state => state.initialize);
  const setLayoutFromRoute = useTemplateEditorStore(state => state.setLayoutFromRoute);

  useTemplateDraftPersistence(notifyAutosave);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const requestedLayout = searchParams.get("layout");

    if (!requestedLayout || !TEMPLATE_LAYOUTS.some(layout => layout.id === requestedLayout)) {
      return;
    }

    setLayoutFromRoute(requestedLayout);
  }, [isHydrated, searchParams, setLayoutFromRoute]);

  if (!isHydrated) {
    return (
      <div className={styles.loadingState}>
        {isHydrating ? "Restoring resume workspace..." : "Preparing editor..."}
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <TemplateEditor />
    </div>
  );
}
