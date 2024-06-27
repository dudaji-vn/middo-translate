'use client';

import { Typography } from '@/components/data-display';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/actions';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { ESPaceRoles } from '../../settings/_components/space-setting/setting-items';

export default function CreateExtensionShortcut() {
  const { t } = useTranslation('common');
  const { space, user: currentUser } = useAuthStore();
  const params = useParams();

  const me = space?.members?.find((member) => member._id === currentUser?._id);
  console.log('me', me);

  return (
    <div
      className={
        'container-height flex w-full  flex-col items-center justify-center gap-2 px-3'
      }
    >
      <Image
        src="/empty_extension.svg"
        width={200}
        height={156}
        alt="empty-extensions"
        className="mx-auto"
      />
      <Typography className="text-lg font-semibold leading-5 text-neutral-800 dark:text-neutral-50">
        {t('EXTENSION.EMPTY.TITLE')}
      </Typography>
      <Typography className="text-neutral-600 dark:text-neutral-200">
        {t('EXTENSION.EMPTY.OWNER_DES')}
      </Typography>
      <div
        className={cn({
          hidden:
            me?.role !== ESPaceRoles.Admin && me?.role !== ESPaceRoles.Owner,
        })}
      >
        <Link
          href={`${ROUTE_NAMES.SPACES}/${params?.spaceId}/settings?modal=create-extension`}
        >
          <Button
            variant={'default'}
            color={'primary'}
            shape={'square'}
            className={'mx-auto mt-4 w-fit'}
          >
            <Plus className="h-4 w-4" />
            <Typography className="ml-2 text-white">
              Create Extension
            </Typography>
          </Button>
        </Link>
      </div>
    </div>
  );
}
