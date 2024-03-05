import { Button, ButtonProps } from '@/components/actions';
import { Typography, TypographyProps } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { School } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode, forwardRef, useState } from 'react';

export type TPhraseItem = {
  name: string;
  icon: ReactNode;
};
export type PhraseItemProps = {
  onClose?: () => void;
  onOpen?: () => void;
  isOpened?: boolean;
  iconWrapperProps?: React.HTMLAttributes<HTMLSpanElement>;
  nameProps?: TypographyProps;
} & TPhraseItem;

export interface PhraseListItemsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const PhraseItem = ({
  name,
  icon,
  isOpened,
  onOpen,
  onClose,
  iconWrapperProps,
  nameProps,
  ...props
}: PhraseItemProps) => {
  return (
    <Button
      className={cn(
        'w-fill relative grid h-[94px] w-full grid-cols-1 place-items-start gap-y-2 rounded-xl p-4  ',
        isOpened ? ' border border-primary-500-main !shadow-lg' : '',
        'z-50 bg-neutral-50/50 hover:!bg-transparent hover:shadow-lg',
      )}
      style={{
        backgroundPosition: 'right',
      }}
      variant={'ghost'}
      {...props}
      onClick={onOpen}
    >
      <span {...iconWrapperProps} className={cn(` [&_svg]:text-white `)}>
        {icon}
      </span>
      <Typography {...nameProps}>{name}</Typography>
    </Button>
  );
};

const PhrasesListItems = forwardRef<
  HTMLDivElement,
  PhraseListItemsProps & { items: TPhraseItem[] }
>(({ className, items, ...props }, ref) => {
  const rowsCount = Math.ceil(items.length / 2);
  const [selectedItem, setSelectedItem] = useState<TPhraseItem['name']>();
  return (
    <div
      {...props}
      className={cn(
        className,
        `grid grid-cols-2 grid-rows-[${rowsCount}]`,
        'gap-3 p-4',
      )}
    >
      {items?.map(({ name, icon, ...rest }, index) => {
        console.log('restProps', rest);
        return (
          <div className="relative" key={name}>
            <div
              className={cn(
                `absolute z-20 inset-0 bg-background bg-origin-content opacity-15`,
              )}
              style={{
                background: `url('/phrases/phrase${index + 1}.svg')`,
                backgroundPosition: `
                right -45% bottom 10px
                `,
                backgroundSize: '45%',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <PhraseItem
              icon={
                <Image
                  src={`/phrases/phrase${index + 1}.svg`}
                  width={34}
                  height={34}
                  alt={name}
                />
              }
              name={name}
              {...rest}
              isOpened={selectedItem == name}
              onOpen={() => {
                setSelectedItem(name);
              }}
            />
          </div>
        );
      })}
    </div>
  );
});
PhrasesListItems.displayName = 'PhraseItem';
PhraseItem.displayName = 'PhraseItem';
export default PhrasesListItems;
