"use client";

import { useShortcutListenStore } from "@/stores/shortcut-listen.store";
import { useTranslateStore } from "@/stores/translate.store";
import { MAPPED_SPECIAL_KEYS } from "@/types/shortcuts";
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
      if ((allowShortcutListener || ignoreFocusingInputs) || ((isFocused || !allowShortcutListener ) &&  event?.ctrlKey )
      ) {
        keysSet?.some((keys) => {
          if (keys?.every(
            (key) => {
              const specialKey = MAPPED_SPECIAL_KEYS[key];
              const isMatched = (key?.toLowerCase() === "shift" && event?.shiftKey) ||
                (key?.toLowerCase() === "ctrl" && event?.ctrlKey) ||
                (key?.toLowerCase() === "alt" && event?.altKey) ||
                (key?.toLowerCase() === "meta" && event?.metaKey) ||
                (typeof key === "string" && event?.key?.toLowerCase() === key?.toLowerCase() ||
                  typeof specialKey === "string" && event?.key?.toLowerCase() === specialKey?.toLowerCase());
              return isMatched;
            }
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