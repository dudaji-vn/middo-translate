import { Button, ButtonProps } from '@/components/actions';
import { Typography, TypographyProps } from '@/components/data-display';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import React, { ReactNode, forwardRef, useState } from 'react';
import PhraseItemViewOptions from './phrase-item-view-options';
import { phraseOptionNames } from './options';
import { SearchParams } from '../../translation/page';
import filter from 'lodash/filter';
import Tip from '@/components/data-display/tip/tip';
import { useTranslation } from 'react-i18next';

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
  extends React.HTMLAttributes<HTMLDivElement> {
  searchParams: SearchParams;
}

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
        'w-fill relative flex-col justify-start  h-full w-full  items-start border border-neutral-50/50 flex place-items-start gap-y-2 rounded-xl !p-3  ',
        isOpened ? ' border border-primary-500-main !shadow-lg' : '',
        'z-50 bg-neutral-50/50 hover:border md:hover:!border-primary-500-main hover:!bg-transparent',
      )}
      style={{
        backgroundPosition: 'right',
        fontSize: '14px',
      }}
      variant={'ghost'}
      {...props}
      onClick={onOpen}
    >
      <span {...iconWrapperProps} className={cn(` [&_svg]:text-white`)}>
        {icon}
      </span>
      <Typography
        {...nameProps}
        className="w-full text-left leading-normal md:text-[0.85em] lg:text-[0.95em] xl:text-[1.1em]"
      >
        {name}
      </Typography>
    </Button>
  );
};

const PhrasesListItems = forwardRef<HTMLDivElement, PhraseListItemsProps>(
  ({ className, searchParams, ...props }, ref) => {
    const [hideTip, setHideTip] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{
      name: TPhraseItem['name'];
      icon: ReactNode;
    }>();

    const {t} = useTranslation('common');
    const closeViewPhraseOptions = () => {
      setSelectedItem(undefined);
    };

    if (selectedItem) {
      return (
        <PhraseItemViewOptions
          phraseItemName={selectedItem.name}
          icon={selectedItem.icon}
          onClose={closeViewPhraseOptions}
          searchParams={searchParams}
        />
      );
    }

    return (
      <div
        {...props}
        className={cn(
          className,
          `grid-rows-auto grid pb-5 grid-cols-2 max-md:pb-5`,
          'gap-3 px-3',
        )}
      >

        <Tip
          tipTitle={t('TRANSLATION.PHRASES_WELCOME')}
          className="col-span-2"
          hideTip={hideTip}
          tipContent={t('TRANSLATION.PHRASES_DESCRIPTION')}
          closeTip={() => setHideTip(true)} />
        {phraseOptionNames?.map((name, index) => {
          const imgNameFile = filter(name, char => /[a-zA-Z]/.test(char)).join('').toLowerCase();
          const icon = (
            <Image
              src={`/phrases/${imgNameFile}.svg`}
              width={34}
              height={34}
              alt={name}
            />
          );
          return (
            <div className="relative" key={name}>
              <div
                className={cn(
                  `absolute inset-0  bg-background bg-origin-content opacity-15 rounded-xl`,
                )}
                style={{
                  background: `url('/phrases/${imgNameFile}.svg')`,
                  backgroundPosition: `
                right -26% bottom 2px
                `,
                  backgroundSize: '35%',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <PhraseItem
                icon={icon}
                name={name}
                isOpened={selectedItem == name}
                onOpen={() => {
                  setSelectedItem({
                    name,
                    icon,
                  });
                }}
                onClose={closeViewPhraseOptions}
              />
            </div>
          );
        })}
      </div>
    );
  },
);
PhrasesListItems.displayName = 'PhraseItem';
PhraseItem.displayName = 'PhraseItem';
export default PhrasesListItems;
