import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { ROUTE_NAMES } from '@/configs/route-name';
import {
  BlocksIcon,
  Download,
  DownloadIcon,
  LanguagesIcon,
  MessageSquare,
  MessagesSquareIcon,
} from 'lucide-react';

export type NavItem = {
  name: string;
  href: string;
  target?: string;
  icon?: JSX.Element;
  type?: 'redirect' | 'scroll' | 'external';
};
const items: NavItem[] = [
  {
    name: 'HEADER.TRANSLATION',
    href: ROUTE_NAMES.TRANSLATION,
    target: '_self',
    icon: <LanguagesIcon size={16} />,
  },
  {
    name: 'HEADER.CONVERSATION',
    href: ROUTE_NAMES.STATIONS,
    target: '_self',
    icon: <MessagesSquareIcon size={16} />,
  },
  {
    name: 'HEADER.EXTENSION',
    href: NEXT_PUBLIC_URL + ROUTE_NAMES.EXTENSION,
    target: '_blank',
    icon: <BlocksIcon size={16} />,
  },
  // {
  //   name: 'HEADER.DOWNLOAD',
  //   href: ROUTE_NAMES.ROOT,
  //   target: '_blank',
  //   icon: <DownloadIcon size={16}/>
  // },
];
const landingPageItems: NavItem[] = [
  {
    name: 'Solution',
    href: 'solution',
    type: 'scroll',
  },
  {
    name: 'Products',
    href: ROUTE_NAMES.TRANSLATION,
    type: 'redirect',
  },
  {
    name: 'Contact us',
    href: 'https://dudaji.vn/#contact',
    target: '_blank',
  },
];

export { items as navItems, landingPageItems as navLandingPageItems };
