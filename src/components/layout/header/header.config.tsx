import { ROUTE_NAMES } from '@/configs/route-name';
import { BlocksIcon, Download, DownloadIcon, LanguagesIcon, MessageSquare, MessagesSquareIcon } from 'lucide-react';

export type NavItem = {
  name: string;
  href: string;
  isShowOnDesktop?: boolean;
  target?: string;
  icon?: JSX.Element;
};
const items: NavItem[] = [
  {
    name: 'HEADER.TRANSLATION',
    href: ROUTE_NAMES.ROOT,
    isShowOnDesktop: true,
    target: '_self',
    icon: <LanguagesIcon size={16}/>
  },
  {
    name: 'HEADER.CONVERSATION',
    href: ROUTE_NAMES.ONLINE_CONVERSATION,
    isShowOnDesktop: true,
    target: '_self',
    icon: <MessagesSquareIcon size={16}/>
  },
  // {
  //   name: 'HEADER.EXTENSION',
  //   href: ROUTE_NAMES.EXTENSION,
  //   isShowOnDesktop: true,
  //   target: '_blank',
  //   icon: <BlocksIcon size={16}/>
  // },
  {
    name: 'HEADER.DOWNLOAD',
    href: ROUTE_NAMES.LANDING_PAGE,
    isShowOnDesktop: false,
    target: '_blank',
    icon: <DownloadIcon size={16}/>
  },
];
const landingPageItems: NavItem[] = [
  {
    name: 'Solution',
    href: 'solution',
    target: '_self',
  },
  {
    name: 'Pricing',
    href: 'pricing',
    target: '_self',
  },
  {
    name: 'Contact us',
    href: 'contact-us',
    target: '_self',
  },
];

export { items as navItems, landingPageItems as navLandingPageItems };
