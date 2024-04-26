import { ChevronsRight, HomeIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/utils/cn';

interface BreadcrumbItem {
  label: string | React.ReactNode;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationBreadcrumbProps {
  items?: BreadcrumbItem[];
}

export function NavigationBreadcrumb({
  items,
  ...props
}: NavigationBreadcrumbProps & React.ComponentPropsWithoutRef<'ol'>) {
  const pathname = usePathname();
  const breadcrumbItems: BreadcrumbItem[] =
    (items ||
      pathname
        ?.split('/')
        ?.filter(Boolean)
        ?.map((item, index, items) => {
          const href = `/${items.slice(0, index + 1).join('/')}`;
          return {
            label: item,
            href,
          };
        })) ??
    [];

  return (
    <Breadcrumb
      {...props}
      className={cn(
        '!h-[42px] w-full bg-primary-100 px-4 py-3 text-neutral-500',
        props.className,
      )}
    >
      <BreadcrumbList>
        {breadcrumbItems.map((item, index, items) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink
              href={item.href}
              className="flex flex-row items-center gap-2 text-sm text-neutral-600 [&_svg]:size-4"
            >
              {item.icon}
              {item.label}
            </BreadcrumbLink>
            <BreadcrumbSeparator
              className={cn({
                hidden: index === items.length - 1,
              })}
            >
              <ChevronsRight className="text-neutral-500" />
            </BreadcrumbSeparator>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
