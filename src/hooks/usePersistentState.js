import { useCallback, useEffect, useRef, useState } from "react";
import {
  getStoredValue,
  migrateLegacyStoredValue,
  setStoredValue,
} from "../storage/appDatabase.js";

const SAVE_DEBOUNCE_MS = 400;

function resolveInitialValue(initialValue) {
  return typeof initialValue === "function" ? initialValue() : initialValue;
}

export function usePersistentState(key, initialValue, onPersist) {
  const [value, setValue] = useState(() => resolveInitialValue(initialValue));
  const [isHydrated, setIsHydrated] = useState(false);
  const [localVersion, setLocalVersion] = useState(0);
  const valueRef = useRef(value);
  const localVersionRef = useRef(0);
  const persistQueueRef = useRef(Promise.resolve());

  const setPersistentValue = useCallback(nextValue => {
    const currentValue = valueRef.current;
    const resolvedValue =
      typeof nextValue === "function" ? nextValue(currentValue) : nextValue;

    if (Object.is(resolvedValue, currentValue)) {
      return;
    }

    valueRef.current = resolvedValue;
    localVersionRef.current += 1;
    setValue(resolvedValue);
    setLocalVersion(localVersionRef.current);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydratePersistentValue() {
      try {
        const indexedDbValue = await getStoredValue(key);
        const storedValue =
          typeof indexedDbValue !== "undefined"
            ? indexedDbValue
            : await migrateLegacyStoredValue(key);

        if (!cancelled && typeof storedValue !== "undefined" && localVersionRef.current === 0) {
          valueRef.current = storedValue;
          setValue(storedValue);
        }
      } catch (error) {
        console.warn(`Unable to read persisted key "${key}".`, error);
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
        }
      }
    }

    void hydratePersistentValue();

    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!isHydrated || localVersion === 0) {
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      const versionToPersist = localVersionRef.current;
      const valueToPersist = valueRef.current;

      persistQueueRef.current = persistQueueRef.current.then(async () => {
        try {
          await setStoredValue(key, valueToPersist);

          if (!cancelled && versionToPersist === localVersionRef.current) {
            onPersist?.();
          }
        } catch (error) {
          console.warn(`Unable to write persisted key "${key}".`, error);
        }
      });
    }, SAVE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [isHydrated, key, localVersion, onPersist]);

  return [value, setPersistentValue, isHydrated];
}
