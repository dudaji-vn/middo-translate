import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { NavItem as INavItem } from './header.config';
import { useElectron } from '@/hooks/use-electron';
import { Languages } from 'lucide-react';

export const NavItem = ({
  item,
  isActive = false,
}: {
  item: INavItem;
  isActive?: boolean;
}) => {
  const {t} = useTranslation('common');
  const {isElectron} = useElectron();
  return (
    <Link
      href={item.href}
      target={isElectron ? '_self' : (item.target || '_self')}
      className={cn(
        'text-neutral-700 py-2 lg:px-3 md:px-2 font-semibold md:hover:bg-primary-200 md:hover:text-primary rounded-xl leading-[18px] md:active:bg-primary-300 flex justify-center items-center gap-2',
        isActive ? '!bg-primary !text-white' : '',
      )}
    >
      {t(item.name)}

      {item.icon}
    </Link>
  );
};
