import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

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
  const {t} = useTranslation('common');
  return (
    <Link
      href={item.href}
      className={cn(
        'bg-background py-2 lg:px-3 md:px-2 font-semibold md:hover:bg-neutral-50 rounded-xl leading-[18px]',
        isActive ? '!bg-primary !text-white' : '',
      )}
    >
      {t(item.name)}
    </Link>
  );
};
