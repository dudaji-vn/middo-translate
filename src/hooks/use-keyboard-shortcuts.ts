"use client";

import { useTranslateStore } from "@/stores/translate.store";
import { useEffect } from "react";

type Key = "shift" | string;

export const useKeyboardShortcut = (
  keys: Key[],
  callback: () => void
) => {
  const {
    isFocused
  } = useTranslateStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFocused &&
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