import Dexie from "dexie";
import { DEFAULT_CV, DEFAULT_TEMPLATE_SETTINGS } from "../config/defaults.js";
import { STORAGE_KEYS } from "../config/storageKeys.js";

export const DEFAULT_RESUME_DRAFT_ID = "resume-default";

const clone = value => JSON.parse(JSON.stringify(value));

const appDatabase = new Dexie("cv-designer");

appDatabase.version(1).stores({
  keyValues: "&key, updatedAt",
  resumeDrafts: "&id, updatedAt, createdAt, name",
});

function createTimestamp() {
  return new Date().toISOString();
}

function createDefaultResumeDraft(overrides = {}) {
  const now = createTimestamp();

  return {
    id: DEFAULT_RESUME_DRAFT_ID,
    name: "Resume 1",
    cv: clone(DEFAULT_CV),
    settings: { ...DEFAULT_TEMPLATE_SETTINGS },
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function parseLegacyJson(rawValue, fallback) {
  if (rawValue === null) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn("Unable to parse legacy localStorage payload.", error);
    return fallback;
  }
}

export async function getStoredValue(key) {
  const record = await appDatabase.keyValues.get(key);
  return record?.value;
}

export async function setStoredValue(key, value) {
  const updatedAt = createTimestamp();

  await appDatabase.keyValues.put({
    key,
    updatedAt,
    value,
  });

  return updatedAt;
}

export async function migrateLegacyStoredValue(key) {
  if (typeof window === "undefined") {
    return null;
  }

  const existingValue = await getStoredValue(key);

  if (typeof existingValue !== "undefined") {
    return existingValue;
  }

  const legacyRawValue = window.localStorage.getItem(key);

  if (legacyRawValue === null) {
    return null;
  }

  const parsedValue = parseLegacyJson(legacyRawValue, null);

  if (parsedValue !== null) {
    await setStoredValue(key, parsedValue);
  }

  return parsedValue;
}

export async function listResumeDrafts() {
  return appDatabase.resumeDrafts.orderBy("updatedAt").reverse().toArray();
}

export async function getResumeDraft(id = DEFAULT_RESUME_DRAFT_ID) {
  return appDatabase.resumeDrafts.get(id);
}

export async function saveResumeDraft(draftRecord) {
  const now = createTimestamp();
  const currentRecord = await getResumeDraft(draftRecord.id);
  const normalizedRecord = {
    ...createDefaultResumeDraft(),
    ...currentRecord,
    ...draftRecord,
    createdAt: draftRecord.createdAt ?? currentRecord?.createdAt ?? now,
    updatedAt: now,
  };

  await appDatabase.resumeDrafts.put(normalizedRecord);
  return normalizedRecord;
}

async function migrateLegacyTemplateDraft(id) {
  if (typeof window === "undefined") {
    return null;
  }

  const legacyCV = parseLegacyJson(window.localStorage.getItem(STORAGE_KEYS.templateCV), null);
  const legacySettings = parseLegacyJson(
    window.localStorage.getItem(STORAGE_KEYS.templateSettings),
    null,
  );

  if (!legacyCV && !legacySettings) {
    return null;
  }

  return createDefaultResumeDraft({
    id,
    cv: legacyCV ?? clone(DEFAULT_CV),
    name: "Imported Resume",
    settings: legacySettings ?? { ...DEFAULT_TEMPLATE_SETTINGS },
  });
}

export async function ensureResumeDraft(id = DEFAULT_RESUME_DRAFT_ID) {
  const existingDraft = await getResumeDraft(id);

  if (existingDraft) {
    return existingDraft;
  }

  const migratedDraft = await migrateLegacyTemplateDraft(id);

  if (migratedDraft) {
    return saveResumeDraft(migratedDraft);
  }

  return saveResumeDraft(createDefaultResumeDraft({ id }));
}

export async function deleteResumeDraft(id) {
  return appDatabase.resumeDrafts.delete(id);
}
