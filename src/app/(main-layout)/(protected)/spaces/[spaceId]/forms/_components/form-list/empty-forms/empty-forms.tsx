import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { use } from 'react';
import { useTranslation } from 'react-i18next';

const EmptyForms = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const pathname = usePathname();
  const t = useTranslation('common').t;
  return (
    <div
      className={cn(
        'flex h-[70vh] w-full flex-col items-center justify-center gap-3',
        props.className,
      )}
    >
      <Image
        src={`/empty-forms.svg`}
        alt="empty-forms"
        width={372}
        height={120}
        className="my-2"
      />
      <Typography className="text-center text-lg font-semibold leading-5 text-neutral-800">
        Your form is almost here!
      </Typography>
      <Typography className="text-center text-neutral-600">
        Create a form, then add it into your script to help you collect
        client&apos;s data more easier
      </Typography>
      <Link href={pathname + '?modal=create'}>
        <Button
          variant={'default'}
          startIcon={<Plus className="h-4 w-4" />}
          color={'primary'}
          shape={'square'}
          className={'mt-5 w-fit'}
        >
          {t('EXTENSION.FORM.ADD_FORM')}
        </Button>
      </Link>
    </div>
  );
};

export default EmptyForms;
