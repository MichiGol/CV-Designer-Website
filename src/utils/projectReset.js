import { DEFAULT_CV, DEFAULT_TEMPLATE_SETTINGS } from "../config/defaults.js";
import { STORAGE_KEYS } from "../config/storageKeys.js";
import { SPLIT_TEMPLATE } from "../hooks/canvas/canvasElementFactory.js";
import {
  DEFAULT_RESUME_DRAFT_ID,
  saveResumeDraft,
  setStoredValue,
} from "../storage/appDatabase.js";

export const PROJECT_RESET_EVENT = "cv-designer:project-reset";

export const DEFAULT_CANVAS_SCALE = 0.75;
export const DEFAULT_CANVAS_SNAP = true;

const clone = value => JSON.parse(JSON.stringify(value));

export async function resetProjectData() {
  const canvasTemplateSeed = SPLIT_TEMPLATE();
  const canvasElements = clone(canvasTemplateSeed);
  const defaultResume = await saveResumeDraft({
    id: DEFAULT_RESUME_DRAFT_ID,
    name: "Resume 1",
    cv: clone(DEFAULT_CV),
    settings: { ...DEFAULT_TEMPLATE_SETTINGS },
  });

  await Promise.all([
    setStoredValue(STORAGE_KEYS.canvasTemplateSeed, clone(canvasTemplateSeed)),
    setStoredValue(STORAGE_KEYS.canvasElements, clone(canvasElements)),
    setStoredValue(STORAGE_KEYS.canvasScale, DEFAULT_CANVAS_SCALE),
    setStoredValue(STORAGE_KEYS.canvasSnap, DEFAULT_CANVAS_SNAP),
  ]);

  return {
    canvasElements,
    canvasScale: DEFAULT_CANVAS_SCALE,
    canvasSnap: DEFAULT_CANVAS_SNAP,
    canvasTemplateSeed,
    savedAt: defaultResume.updatedAt,
  };
}
