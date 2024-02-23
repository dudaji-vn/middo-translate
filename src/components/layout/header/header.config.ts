import { ROUTE_NAMES } from '@/configs/route-name';

export type NavItem = {
  name: string;
  href: string;
};
const items: NavItem[] = [
  {
    name: 'Translation',
    href: ROUTE_NAMES.ROOT,
  },
  {
    name: 'Conversation',
    href: ROUTE_NAMES.ONLINE_CONVERSATION,
  },
  // {
  //   name: 'Duel',
  //   href: '#',
  // },
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
