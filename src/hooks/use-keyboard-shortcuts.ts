"use client";

import { useShortcutListenStore } from "@/stores/shortcut-listen.store";
import { useTranslateStore } from "@/stores/translate.store";
import { useEffect } from "react";

type Key = "shift" | string;

export const useKeyboardShortcut = (
  keysSet: Array<Key[]>,
  callback: (event?: KeyboardEvent) => void
) => {
  const {
    isFocused
  } = useTranslateStore();
  const { allowShortcutListener } = useShortcutListenStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFocused && allowShortcutListener &&
        keysSet?.some((keys) =>
          keys?.every(
            (key) =>
              (key.toLowerCase() === "shift" && event.shiftKey) ||
              (typeof key === "string" && event.key.toLowerCase() === key.toLowerCase())
          )
        )
      ) {
        callback(event);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keysSet, callback, isFocused]);
};