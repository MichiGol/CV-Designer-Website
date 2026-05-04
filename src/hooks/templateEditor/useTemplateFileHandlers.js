import { useCallback, useRef } from "react";

import { useTemplateEditorStore } from "../../store/templateEditorStore.js";

const DEFAULT_PHOTO_SCALE = 1;
const DEFAULT_PHOTO_POSITION = 50;
const EMPTY_JSON_OBJECT = "{}";

function resetFileInput(event) {
  event.target.value = "";
}

export function useTemplateFileHandlers() {
  const importResumeJson = useTemplateEditorStore(state => state.importResumeJson);
  const photoRef = useRef(null);
  const jsonRef = useRef(null);

  const handlePhotoUpload = useCallback(event => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => {
      const result = loadEvent.target?.result ?? null;
      const { updatePersonal } = useTemplateEditorStore.getState();

      updatePersonal("photo", result);
      updatePersonal("photoScale", DEFAULT_PHOTO_SCALE);
      updatePersonal("photoPositionX", DEFAULT_PHOTO_POSITION);
      updatePersonal("photoPositionY", DEFAULT_PHOTO_POSITION);
    };
    reader.readAsDataURL(file);
    resetFileInput(event);
  }, []);

  const handleJSONImport = useCallback(
    event => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = loadEvent => {
        try {
          importResumeJson(JSON.parse(loadEvent.target?.result ?? EMPTY_JSON_OBJECT));
        } catch (error) {
          console.warn("Unable to import resume JSON.", error);
        }
      };
      reader.readAsText(file);
      resetFileInput(event);
    },
    [importResumeJson],
  );

  const handleOpenJsonImport = useCallback(() => {
    jsonRef.current?.click();
  }, []);

  return {
    handleJSONImport,
    handleOpenJsonImport,
    handlePhotoUpload,
    jsonRef,
    photoRef,
  };
}
