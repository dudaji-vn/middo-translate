import { ROUTE_NAMES } from '@/configs/route-name';

export type NavItem = {
  name: string;
  href: string;
  isShowOnDesktop?: boolean;
};
const items: NavItem[] = [
  {
    name: 'HEADER.TRANSLATION',
    href: ROUTE_NAMES.ROOT,
    isShowOnDesktop: true,
  },
  {
    name: 'HEADER.CONVERSATION',
    href: ROUTE_NAMES.ONLINE_CONVERSATION,
    isShowOnDesktop: true,
  },
  {
    name: 'HEADER.EXTENSION',
    href: ROUTE_NAMES.EXTENSION,
    isShowOnDesktop: true,
  },
  {
    name: 'HEADER.DOWNLOAD',
    href: ROUTE_NAMES.LANDING_PAGE,
    isShowOnDesktop: false,
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
