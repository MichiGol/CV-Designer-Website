import { createContext, useCallback, useContext, useState } from "react";

const AutosaveContext = createContext(null);

export function AutosaveProvider({ children }) {
  const [autosaveToast, setAutosaveToast] = useState({ key: 0, open: false });

  const notifyAutosave = useCallback(() => {
    setAutosaveToast(current => ({ key: current.key + 1, open: true }));
  }, []);

  const closeAutosaveToast = useCallback(() => {
    setAutosaveToast(current => ({ ...current, open: false }));
  }, []);

  const handleAutosaveToastClose = useCallback(
    (_event, reason) => {
      if (reason === "clickaway") {
        return;
      }

      closeAutosaveToast();
    },
    [closeAutosaveToast],
  );

  return (
    <AutosaveContext.Provider
      value={{
        autosaveToast,
        notifyAutosave,
        closeAutosaveToast,
        handleAutosaveToastClose,
      }}
    >
      {children}
    </AutosaveContext.Provider>
  );
}

export function useAutosave() {
  const context = useContext(AutosaveContext);

  if (!context) {
    throw new Error("useAutosave must be used inside an AutosaveProvider.");
  }

  return context;
}
