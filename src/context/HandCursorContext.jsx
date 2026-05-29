"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const HandCursorContext = createContext(null);

export function HandCursorProvider({ children }) {
  const [enabled, setEnabled] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState("Off");
  const [error, setError] = useState(null);

  const toggle = useCallback(() => {
    setEnabled((on) => !on);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      toggle,
      tracking,
      setTracking,
      status,
      setStatus,
      error,
      setError,
    }),
    [enabled, toggle, tracking, status, error]
  );

  return (
    <HandCursorContext.Provider value={value}>
      {children}
    </HandCursorContext.Provider>
  );
}

export function useHandCursor() {
  const ctx = useContext(HandCursorContext);
  if (!ctx) {
    throw new Error("useHandCursor must be used within HandCursorProvider");
  }
  return ctx;
}

export function useHandCursorOptional() {
  return useContext(HandCursorContext);
}
