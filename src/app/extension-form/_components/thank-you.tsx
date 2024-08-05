import { CreateBusinessForm } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/forms/_components/form-creation/schema';
import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { BusinessForm } from '@/types/forms.type';
import { FileText, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const ThankYou = (
  props: Partial<CreateBusinessForm> & {
    onclose: () => void;
    btnName?: string;
  },
) => {
  const { thankyou, name, onclose } = props;
  return (
    <div className="flex size-full flex-col bg-white pb-6 md:rounded-xl">
      <div className="flex flex-none flex-row items-center gap-2 bg-neutral-50 p-3 text-primary-500-main md:rounded-t-xl">
        <FileText className="size-5" />
        <Typography className="text-md  font-semibold text-primary-500-main">
          {name}
        </Typography>
      </div>
      <div className="flex w-full grow flex-col items-center justify-center gap-3 overflow-y-auto   p-10">
        {thankyou?.image && (
          <div className="flex aspect-[4/3] max-h-[300px] w-full max-w-[400px] flex-col  items-center justify-center gap-2 p-2 md:w-[30vw] md:rounded-[12px] ">
            <Image
              src={thankyou.image}
              alt="thankyou-image"
              width={400}
              height={300}
            />
          </div>
        )}
        <div className="flex w-full  flex-col items-center  justify-center gap-2">
          <Typography
            variant={'h1'}
            className="font-semibold text-primary-500-main"
          >
            {thankyou?.title}
          </Typography>
          <Typography>{thankyou?.subtitle}</Typography>
        </div>
      </div>
      <Button
        color="primary"
        variant="default"
        shape={'square'}
        onClick={onclose}
        className="mx-auto w-fit"
      >
        {props.btnName || 'Close Form'}
      </Button>
    </div>
  );
};

export default ThankYou;
