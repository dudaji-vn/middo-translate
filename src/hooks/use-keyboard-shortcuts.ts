"use client";

import { useEffect } from "react";

type Key = "shift" | string;

export const useKeyboardShortcut = (
  keys: Key[],
  callback: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('keys', event.key)
      event.preventDefault();
      if (
        keys.every(
          (key) =>
            (key === "shift" && event.shiftKey) ||
            (typeof key === "string" && event.key.toLowerCase() === key.toLowerCase())
        )
      ) {
        callback();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, callback]);
};