import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { NavItem as INavItem } from './header.config';

export const NavItem = ({
  item,
  isActive = false,
}: {
  item: INavItem;
  isActive?: boolean;
}) => {
  const {t} = useTranslation('common');
  return (
    <Link
      href={item.href}
      target={item.target || '_self'}
      className={cn(
        'text-neutral-700 py-2 lg:px-3 md:px-2 font-semibold md:hover:bg-primary-200 md:hover:text-primary rounded-xl leading-[18px]',
        isActive ? '!bg-primary !text-white' : '',
      )}
    >
      {t(item.name)}
    </Link>
  );
};
