import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { cn } from '@/utils/cn';
import { LayoutGrid } from 'lucide-react';
import React, { PropsWithChildren, memo } from 'react';
import { useTranslation } from 'react-i18next';
interface ChangeToGalleryViewProps {
  isExpandFull?: boolean;
}
const ChangeToGalleryView = ({ children, isExpandFull }: PropsWithChildren & ChangeToGalleryViewProps) => {
  const { t } = useTranslation('common');

  const layout = useVideoCallStore((state) => state.layout);
  const setLayout = useVideoCallStore((state) => state.setLayout);
  const isDrawing = useVideoCallStore((state) => state.isDrawing);
  const expandVideoItem = () => {
    if(isExpandFull) return;
    setLayout(
      layout === VIDEOCALL_LAYOUTS.FOCUS_VIEW
        ? VIDEOCALL_LAYOUTS.GALLERY_VIEW
        : VIDEOCALL_LAYOUTS.FOCUS_VIEW,
    );
  };
  if (isDrawing) return null;
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/80 text-white opacity-0 transition-all md:hover:opacity-100',
        isExpandFull ? 'bg-transparent' : '' 
      )}
    >
      {!isExpandFull && 
        <div
          className={cn(
            'absolute inset-7 flex  flex-col items-center justify-center gap-1',
          )}
          onClick={expandVideoItem}
        >
          <LayoutGrid className="h-4 w-4" />
          <p className="text-center text-sm">{t('CONVERSATION.GALLERY_VIEW')}</p>
        </div>
        }
      {children}
    </div>
  );
};

export default memo(ChangeToGalleryView);
