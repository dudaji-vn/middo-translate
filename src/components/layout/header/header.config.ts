import { ROUTE_NAMES } from '@/configs/route-name';

export type NavItem = {
  name: string;
  href: string;
  isShowOnDesktop?: boolean;
  target?: string;
};
const items: NavItem[] = [
  {
    name: 'HEADER.TRANSLATION',
    href: ROUTE_NAMES.ROOT,
    isShowOnDesktop: true,
    target: '_self',
  },
  {
    name: 'HEADER.CONVERSATION',
    href: ROUTE_NAMES.ONLINE_CONVERSATION,
    isShowOnDesktop: true,
    target: '_self',
  },
  {
    name: 'HEADER.EXTENSION',
    href: ROUTE_NAMES.EXTENSION,
    isShowOnDesktop: true,
    target: '_blank',
  },
  {
    name: 'HEADER.DOWNLOAD',
    href: ROUTE_NAMES.LANDING_PAGE,
    isShowOnDesktop: false,
    target: '_blank',
  },
];
const landingPageItems: NavItem[] = [
  {
    name: 'Solution',
    href: 'solution',
  },
  {
    name: 'About us',
    href: 'about-us',
  },
];

export { items as navItems, landingPageItems as navLandingPageItems };
