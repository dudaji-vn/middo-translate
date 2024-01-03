import { ROUTE_NAMES } from '@/configs/route-name';

type NavItem = {
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
  {
    name: 'Duel',
    href: '#',
  },
];

export { items as navItems };
