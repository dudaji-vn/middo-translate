import { GalleryThumbnails, LayoutGrid, Square } from "lucide-react";

export interface LayoutInterface {
    name: string;
    value: string;
    icon: JSX.Element;
}

export const VIDEOCALL_LAYOUTS_OPTION: Record<string, LayoutInterface> = {
    GALLERY_VIEW: {
        name: 'Galery view',
        value: 'GALLERY_VIEW',
        icon: <LayoutGrid className="w-4 h-4" />,
    },
    SPEAKER_VIEW: {
        name: 'Speaker view',
        value: 'SPEAKER_VIEW',
        icon: <GalleryThumbnails className="w-4 h-4" />,
    },
    FOCUS_VIEW: {
        name: 'Focus view',
        value: 'FOCUS_VIEW',
        icon: <Square className="w-4 h-4" />,
    },
}

export const VIDEOCALL_LAYOUTS = {
    GALLERY_VIEW: 'GALLERY_VIEW',
    SPEAKER_VIEW: 'SPEAKER_VIEW',
    FOCUS_VIEW: 'FOCUS_VIEW',
    SHARE_SCREEN: 'SHARE_SCREEN',
}