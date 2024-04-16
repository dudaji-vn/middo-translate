import { ROUTE_NAMES } from '@/configs/route-name';

export type NavItem = {
  name: string;
  href: string;
};
const items: NavItem[] = [
  {
    name: 'HEADER.TRANSLATION',
    href: ROUTE_NAMES.ROOT,
  },
  {
    name: 'HEADER.CONVERSATION',
    href: ROUTE_NAMES.ONLINE_CONVERSATION,
  },
  {
    name: 'HEADER.EXTENSION',
    href: ROUTE_NAMES.EXTENSION,
  },
  {
    name: 'HEADER.DOWNLOAD',
    href: ROUTE_NAMES.LANDING_PAGE,
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
