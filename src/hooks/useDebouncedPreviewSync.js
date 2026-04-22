import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";

export function useDebouncedPreviewSync(value, delay = 300) {
  const deferredValue = useDeferredValue(value);
  const [previewValue, setPreviewValue] = useState(deferredValue);
  const [isPreviewPending, setIsPreviewPending] = useState(false);
  const latestValueRef = useRef(deferredValue);

  useEffect(() => {
    latestValueRef.current = deferredValue;

    if (Object.is(previewValue, deferredValue)) {
      setIsPreviewPending(false);
      return undefined;
    }

    setIsPreviewPending(true);

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setPreviewValue(latestValueRef.current);
        setIsPreviewPending(false);
      });
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, deferredValue, previewValue]);

  return {
    deferredValue,
    isPreviewPending,
    previewValue,
  };
}
