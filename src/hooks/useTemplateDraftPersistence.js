import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { saveResumeDraft } from "../storage/appDatabase.js";
import { selectPersistableDraft, useTemplateEditorStore } from "../store/templateEditorStore.js";

const SAVE_DEBOUNCE_MS = 500;

export function useTemplateDraftPersistence(onPersist) {
  useEffect(() => {
    let timeoutId = null;

    const unsubscribe = useTemplateEditorStore.subscribe(
      selectPersistableDraft,
      (currentDraft, previousDraft) => {
        if (!currentDraft.isHydrated || !previousDraft?.isHydrated) {
          return;
        }

        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(async () => {
          try {
            useTemplateEditorStore.getState().markPersisting();

            const savedRecord = await saveResumeDraft({
              id: currentDraft.id,
              name: currentDraft.name,
              cv: {
                personal: currentDraft.personal,
                education: currentDraft.education,
                experience: currentDraft.experience,
                skills: currentDraft.skills,
                languages: currentDraft.languages,
                hobbies: currentDraft.hobbies,
              },
              settings: currentDraft.settings,
            });

            useTemplateEditorStore.getState().markPersisted(savedRecord.updatedAt);
            onPersist?.();
          } catch (error) {
            console.warn("Unable to persist the resume draft to IndexedDB.", error);
            useTemplateEditorStore
              .getState()
              .markPersistFailed("Unable to persist the resume draft.");
          }
        }, SAVE_DEBOUNCE_MS);
      },
      {
        equalityFn: shallow,
      },
    );

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [onPersist]);
}
