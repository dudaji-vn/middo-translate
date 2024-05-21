import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { NavItem as INavItem } from './header.config';
import { useElectron } from '@/hooks/use-electron';

export const NavItem = ({
  item,
  isActive = false,
}: {
  item: INavItem;
  isActive?: boolean;
}) => {
  const { t } = useTranslation('common');
  const { isElectron } = useElectron();
  return (
    <Link
      href={item.href}
      target={isElectron ? '_self' : item.target || '_self'}
      className={cn(
        'flex h-9 items-center justify-center gap-2 rounded-xl py-2 font-semibold leading-[18px] text-neutral-700 md:px-2 md:hover:bg-primary-200 md:hover:text-primary md:active:bg-primary-300 lg:px-3',
        isActive ? '!bg-primary !text-white' : '',
      )}
    >
      {t(item.name)}

      {item.icon}
    </Link>
  );
};
