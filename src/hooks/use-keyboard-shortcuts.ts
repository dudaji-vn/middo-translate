"use client";

import { useShortcutListenStore } from "@/stores/shortcut-listen.store";
import { useTranslateStore } from "@/stores/translate.store";
import { useEffect } from "react";

type Key = "shift" | string;

export const useKeyboardShortcut = (
  keysSet: Array<Key[]>,
  callback: (event?: KeyboardEvent, matchedKeys?: string[]) => void,
  ignoreFocusingInputs?: boolean,
) => {
  const {
    isFocused
  } = useTranslateStore();
  const { allowShortcutListener } = useShortcutListenStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFocused && (allowShortcutListener || ignoreFocusingInputs)
      ) {
        keysSet?.some((keys) => {
          if (keys?.every(
            (key) =>
              (key?.toLowerCase() === "shift" && event?.shiftKey) ||
              (key?.toLowerCase() === "ctrl" && event?.ctrlKey) ||
              (key?.toLowerCase() === "alt" && event?.altKey) ||
              (typeof key === "string" && event?.key?.toLowerCase() === key?.toLowerCase())
          )
          ) {
            event?.preventDefault();
            callback(event, keys);
            return true;
          }
        }
        )
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keysSet, callback, isFocused, allowShortcutListener, ignoreFocusingInputs]);
};