import { DropdownMenuItem } from '@/components/data-display';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { ScanText } from 'lucide-react';
import React, { useCallback } from 'react';

const SHORTCUT_TOGGLE_CAPTION = ['l'];
export default function ActionToggleCaption() {
  const { isShowCaption, setShowCaption } = useVideoCallStore();

  const onToggleCaption = useCallback(() => {
    setShowCaption(!isShowCaption);
  }, [isShowCaption, setShowCaption]);

  useKeyboardShortcut(SHORTCUT_TOGGLE_CAPTION, onToggleCaption);
  return (
    <DropdownMenuItem
      onClick={() => setShowCaption(!isShowCaption)}
      className={isShowCaption ? 'bg-primary-200' : ''}
    >
      <ScanText />
      <span className="ml-2">Caption</span>
    </DropdownMenuItem>
  );
}
