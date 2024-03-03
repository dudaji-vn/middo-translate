"use client";

import { useShortcutListenStore } from "@/stores/shortcut-listen.store";
import { useTranslateStore } from "@/stores/translate.store";
import { MAPPED_MAC_KEYS, MAPPED_WIN_KEYS } from "@/types/shortcuts";
import { useEffect, useState } from "react";

type Key = "shift" | string;
type OS = "MAC" | "WINDOWS";

export const useKeyboardShortcut = (
  keysSet: Array<Key[]>,
  callback: (event?: KeyboardEvent, matchedKeys?: string[]) => void,
  ignoreFocusingInputs?: boolean,
) => {
  const {
    isFocused
  } = useTranslateStore();
  const { allowShortcutListener } = useShortcutListenStore();
  const [isMacOS, setIsMacOS] = useState(false);

  useEffect(() => {
    const detectOS = () => {
      const { userAgent } = window.navigator;
      setIsMacOS(/Mac/.test(userAgent));
    };
    detectOS();
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((allowShortcutListener || ignoreFocusingInputs) || ((isFocused || !allowShortcutListener) && event?.ctrlKey)
      ) {
        keysSet?.some((keys) => {
          if (keys?.every(
            (key) => {
              const keyByOS = (isMacOS ? MAPPED_MAC_KEYS[key] : MAPPED_WIN_KEYS[key]) || key;
              const isMatched = (keyByOS?.toLowerCase() === "shift" && event?.shiftKey) ||
                (keyByOS?.toLowerCase() === "ctrl" && event?.ctrlKey) ||
                (keyByOS?.toLowerCase() === "alt" && event?.altKey) ||
                (keyByOS?.toLowerCase() === "meta" && event?.metaKey) ||
                (typeof keyByOS === "string" && event?.key?.toLowerCase() === keyByOS?.toLowerCase());
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
  }, [keysSet, callback, isMacOS, isFocused, allowShortcutListener, ignoreFocusingInputs]);
  return { isMacOS }
};