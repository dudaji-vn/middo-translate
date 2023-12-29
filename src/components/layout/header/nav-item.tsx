import Link from 'next/link';
import { cn } from '@/utils/cn';

export const NavItem = ({
  item,
  isActive = false,
}: {
  item: {
    name: string;
    href: string;
  };
  isActive?: boolean;
}) => {
  return (
    <Link
      href={item.href}
      className={cn(
        'bg-background px-[5vw] py-4 text-sm font-semibold md:!p-0 md:hover:text-primary',
        isActive ? '!text-primary' : 'active:!text-primary-700',
      )}
    >
      {item.name}
    </Link>
  );
};
