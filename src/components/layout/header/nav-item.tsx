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

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topPos = element.getBoundingClientRect().top;
      window.scrollTo({
        top: topPos - 52,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Link
      href={item.href}
      target={isElectron ? '_self' : item.target || '_self'}
      {...(item.type === 'scroll'
        ? {
            onClick: (e) => {
              e.preventDefault();
              scrollTo(item.href);
            },
          }
        : {})}
      className={cn(
        'flex h-9 items-center justify-center gap-2 rounded-xl py-2 font-semibold leading-[18px] text-neutral-700 dark:text-neutral-100 md:px-2 md:hover:bg-primary-200 dark:md:hover:bg-neutral-600 md:hover:text-primary dark:md:hover:text-neutral-50 md:active:bg-primary-300 lg:px-3',
        isActive ? '!bg-primary !text-white' : '',
      )}
    >
      {t(item.name)}

      {item.icon}
    </Link>
  );
};
