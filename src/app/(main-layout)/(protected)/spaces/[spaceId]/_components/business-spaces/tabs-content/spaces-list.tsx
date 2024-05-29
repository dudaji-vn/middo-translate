import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
import React from 'react';
import { BusinessTabType, TSpace, TSpaceTag } from '..';
import Space from './space-card/space';
import { useAuthStore } from '@/stores/auth.store';
import SpacesListSkeletons from '../skeletons/spaces-list-skeletons';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

function EmptyContent({
  createProps,
  ...props
}: {
  createProps?: Omit<LinkProps, 'href'> &
    React.HTMLAttributes<HTMLAnchorElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation('common');
  return (
    <div
      {...props}
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-3',
        props.className,
      )}
    >
      <Image
        src={`/empty-space.svg`}
        alt="empty-space"
        width={372}
        height={120}
        className="mx-auto"
      />
      <Typography className="text-center text-lg font-semibold leading-5 text-neutral-800">
        A little bit empty!
      </Typography>
      <Typography className="text-center text-neutral-600">
        Create a space so that you could invite another to manage your business
      </Typography>
      <Link href={ROUTE_NAMES.SPACES + '?modal=create-space'} {...createProps}>
        <Button
          variant={'default'}
          startIcon={<Plus className="h-4 w-4" />}
          color={'primary'}
          shape={'square'}
          className={'mt-5 w-fit'}
        >
          {t('EXTENSION.SPACE.CREATE_SPACE')}
        </Button>
      </Link>
    </div>
  );
}

const SpacesList = ({
  loading = false,
  spaces,
  tab,
}: {
  spaces: TSpace[];
  tab?: BusinessTabType;
  loading?: boolean;
}) => {
  const currentUser = useAuthStore((s) => s.user);
  if (!loading && (!spaces || spaces.length === 0)) {
    return <EmptyContent className={tab === 'joined_spaces' ? 'hidden' : ''} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-[5vw] py-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {loading && <SpacesListSkeletons count={3} />}
      {spaces?.map((space, index) => {
        console.log('space', space);
        return (
          <Space
            key={space._id}
            data={space}
            tag={currentUser?._id === space.owner?._id ? 'my' : 'joined'}
          />
        );
      })}
    </div>
  );
};

export default SpacesList;
