import { produce } from "immer";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { DEFAULT_CV, DEFAULT_TEMPLATE_SETTINGS, TEMPLATE_COLOR_DEFAULTS } from "../config/defaults.js";
import { DEFAULT_RESUME_DRAFT_ID, ensureResumeDraft } from "../storage/appDatabase.js";

const ARRAY_SECTIONS = ["education", "experience", "skills", "languages"];

let uidSeed = 500;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getDefaultState() {
  return {
    personal: clone(DEFAULT_CV.personal),
    education: clone(DEFAULT_CV.education),
    experience: clone(DEFAULT_CV.experience),
    skills: clone(DEFAULT_CV.skills),
    languages: clone(DEFAULT_CV.languages),
    hobbies: clone(DEFAULT_CV.hobbies),
    settings: { ...DEFAULT_TEMPLATE_SETTINGS },
    meta: {
      activeResumeId: DEFAULT_RESUME_DRAFT_ID,
      draftName: "Resume 1",
      isHydrated: false,
      isHydrating: false,
      isPersisting: false,
      lastSavedAt: null,
      persistError: null,
    },
  };
}

function nextId() {
  uidSeed += 1;
  return String(uidSeed);
}

function syncUidSeed(state) {
  const maxKnownId = ARRAY_SECTIONS.flatMap(section => state[section])
    .reduce((maxId, item) => {
      const parsedId = Number.parseInt(`${item.id ?? ""}`, 10);
      return Number.isFinite(parsedId) ? Math.max(maxId, parsedId) : maxId;
    }, uidSeed);

  uidSeed = Math.max(uidSeed, maxKnownId);
}

function applyDraftToState(state, draftRecord) {
  const cv = draftRecord.cv ?? DEFAULT_CV;
  const incomingSettings = draftRecord.settings ?? {};
  const mergedSettings = {
    ...DEFAULT_TEMPLATE_SETTINGS,
    ...incomingSettings,
  };
  const colorDefaults = TEMPLATE_COLOR_DEFAULTS[mergedSettings.layout];

  if (colorDefaults) {
    mergedSettings.headerBg = incomingSettings.headerBg ?? colorDefaults.headerBg;
    mergedSettings.bodyBg = incomingSettings.bodyBg ?? colorDefaults.bodyBg;
  }

  state.personal = {
    ...clone(DEFAULT_CV.personal),
    ...clone(cv.personal ?? {}),
  };
  state.education = clone(cv.education ?? DEFAULT_CV.education);
  state.experience = clone(cv.experience ?? DEFAULT_CV.experience);
  state.skills = clone(cv.skills ?? DEFAULT_CV.skills);
  state.languages = clone(cv.languages ?? DEFAULT_CV.languages);
  state.hobbies = clone(cv.hobbies ?? DEFAULT_CV.hobbies);
  state.settings = mergedSettings;
  state.meta.activeResumeId = draftRecord.id ?? DEFAULT_RESUME_DRAFT_ID;
  state.meta.draftName = draftRecord.name ?? "Resume 1";
  state.meta.lastSavedAt = draftRecord.updatedAt ?? null;
}

function applyDefaultsToState(state, updatedAt = null) {
  const defaultState = getDefaultState();

  state.personal = defaultState.personal;
  state.education = defaultState.education;
  state.experience = defaultState.experience;
  state.skills = defaultState.skills;
  state.languages = defaultState.languages;
  state.hobbies = defaultState.hobbies;
  state.settings = defaultState.settings;
  state.meta.activeResumeId = DEFAULT_RESUME_DRAFT_ID;
  state.meta.draftName = "Resume 1";
  state.meta.isHydrated = true;
  state.meta.isHydrating = false;
  state.meta.isPersisting = false;
  state.meta.lastSavedAt = updatedAt;
  state.meta.persistError = null;
}

function applyLayoutChange(state, layoutId) {
  if (state.settings.layout === layoutId) {
    return;
  }

  state.settings.layout = layoutId;

  const colorDefaults = TEMPLATE_COLOR_DEFAULTS[layoutId];

  if (colorDefaults) {
    Object.assign(state.settings, colorDefaults);
  }
}

function mutateArraySectionItem(state, section, id, fieldOrRecipe, nextValue) {
  const item = state[section].find(entry => entry.id === id);

  if (!item) {
    return;
  }

  if (typeof fieldOrRecipe === "function") {
    fieldOrRecipe(item);
    return;
  }

  item[fieldOrRecipe] = nextValue;
}

export function selectEditorSections(state) {
  return {
    education: state.education,
    experience: state.experience,
    hobbies: state.hobbies,
    languages: state.languages,
    personal: state.personal,
    settings: state.settings,
    skills: state.skills,
  };
}

export function buildResumeSnapshot(sections) {
  return {
    cv: {
      personal: sections.personal,
      education: sections.education,
      experience: sections.experience,
      skills: sections.skills,
      languages: sections.languages,
      hobbies: sections.hobbies,
    },
    settings: sections.settings,
  };
}

export function selectPersistableDraft(state) {
  return {
    id: state.meta.activeResumeId,
    name: state.meta.draftName,
    personal: state.personal,
    education: state.education,
    experience: state.experience,
    skills: state.skills,
    languages: state.languages,
    hobbies: state.hobbies,
    settings: state.settings,
    isHydrated: state.meta.isHydrated,
  };
}

export const useTemplateEditorStore = create(
  subscribeWithSelector((set, get) => ({
    ...getDefaultState(),
    initialize: async () => {
      const { meta } = get();

      if (meta.isHydrated || meta.isHydrating) {
        return;
      }

      set(
        produce(state => {
          state.meta.isHydrating = true;
          state.meta.persistError = null;
        }),
      );

      try {
        const draftRecord = await ensureResumeDraft(meta.activeResumeId);

        set(
          produce(state => {
            applyDraftToState(state, draftRecord);
            state.meta.isHydrated = true;
            state.meta.isHydrating = false;
            state.meta.persistError = null;
          }),
        );

        syncUidSeed(get());
      } catch (error) {
        console.warn("Unable to hydrate the template editor from IndexedDB.", error);

        set(
          produce(state => {
            state.meta.isHydrated = true;
            state.meta.isHydrating = false;
            state.meta.persistError = "Unable to restore the saved resume draft.";
          }),
        );
      }
    },
    setLayoutFromRoute: layoutId =>
      set(
        produce(state => {
          applyLayoutChange(state, layoutId);
        }),
      ),
    updatePersonal: (field, value) =>
      set(
        produce(state => {
          state.personal[field] = value;
        }),
      ),
    setHobbiesFromInput: rawValue =>
      set(
        produce(state => {
          state.hobbies = rawValue
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
        }),
      ),
    addSectionItem: (section, template) =>
      set(
        produce(state => {
          state[section].push({ id: nextId(), ...template });
        }),
      ),
    updateSectionItem: (section, id, fieldOrRecipe, nextValue) =>
      set(
        produce(state => {
          mutateArraySectionItem(state, section, id, fieldOrRecipe, nextValue);
        }),
      ),
    deleteSectionItem: (section, id) =>
      set(
        produce(state => {
          state[section] = state[section].filter(item => item.id !== id);
        }),
      ),
    patchSettings: patch =>
      set(
        produce(state => {
          if (patch.layout) {
            applyLayoutChange(state, patch.layout);
          }

          Object.assign(state.settings, patch);
        }),
      ),
    importResumeJson: importedCV =>
      set(
        produce(state => {
          applyDraftToState(
            state,
            {
              cv: importedCV ?? DEFAULT_CV,
              id: state.meta.activeResumeId,
              name: state.meta.draftName,
              settings: state.settings,
              updatedAt: state.meta.lastSavedAt,
            },
          );
        }),
      ),
    resetToDefaults: updatedAt => {
      set(
        produce(state => {
          applyDefaultsToState(state, updatedAt);
        }),
      );

      syncUidSeed(get());
    },
    markPersisting: () =>
      set(
        produce(state => {
          state.meta.isPersisting = true;
          state.meta.persistError = null;
        }),
      ),
    markPersisted: timestamp =>
      set(
        produce(state => {
          state.meta.isPersisting = false;
          state.meta.lastSavedAt = timestamp;
          state.meta.persistError = null;
        }),
      ),
    markPersistFailed: message =>
      set(
        produce(state => {
          state.meta.isPersisting = false;
          state.meta.persistError = message;
        }),
      ),
  })),
);

useTemplateEditorStore.subscribe(
  state => ({
    education: state.education,
    experience: state.experience,
    languages: state.languages,
    skills: state.skills,
  }),
  state => {
    syncUidSeed(state);
  },
);
