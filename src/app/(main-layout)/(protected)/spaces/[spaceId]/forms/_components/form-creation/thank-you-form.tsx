import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { Switch } from '@/components/data-entry';
import RHFImageInput from '@/components/form/RHF/RHFImageInput/RHFImageInput';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { ImageIcon } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const ThankYouForm = () => {
  const { setValue, watch } = useFormContext();
  const [hasHeading, setHasHeading] = React.useState(true);
  const [hasParagraph, setHasParagraph] = React.useState(true);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div className="flex h-fit w-full flex-col items-center justify-center gap-3">
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row items-center gap-2 text-neutral-600">
            <Typography>Heading</Typography>
            <Switch
              checked={hasHeading}
              onCheckedChange={() => {
                setHasHeading(!hasHeading);
                if (!hasHeading) {
                  setValue('thankyou.title', undefined);
                }
              }}
            />
          </div>
          <div className="flex flex-row items-center gap-2 text-neutral-600">
            <Typography>Paragraph</Typography>
            <Switch
              checked={hasParagraph}
              onCheckedChange={() => {
                setHasParagraph(!hasParagraph);
                if (!hasParagraph) {
                  setValue('thankyou.subtitle', undefined);
                }
              }}
            />
          </div>
        </div>
        <Typography className="font-light  text-neutral-600">
          * This page will appear after the form has been successfully submitted
        </Typography>
      </div>
      <RHFImageInput
        nameField="thankyou.image"
        onUploadDone={() => {}}
        cropperProps={{
          className: '',
          aspectRatio: 4 / 3,
          initialAspectRatio: 4 / 3,
        }}
        previewProps={{
          className:
            'aspect-[4/3] max-h-[300px] w-full max-w-[400px]  rounded-[12px]  md:w-[30vw] ',
        }}
      >
        <div className="flex aspect-[4/3] max-h-[300px] w-full max-w-[400px] flex-col  items-center justify-center gap-2 rounded-[12px] border border-dashed border-primary-500-main p-2 md:w-[30vw] ">
          <Button.Icon color="primary" size="lg">
            <ImageIcon />
          </Button.Icon>
          <Typography className="text-neutral-800">Add Image</Typography>
          <Typography className="text-center font-light text-neutral-600">
            Image size must be smaller than 25MB
            <br />
            with 4:3 aspect ratio
          </Typography>
        </div>
      </RHFImageInput>

      <div className="w-full">
        <RHFInputField
          name="thankyou.title"
          formItemProps={{
            className: hasHeading ? 'w-full px-5' : 'hidden',
          }}
          inputProps={{
            placeholder: 'Thank you',
            className:
              'p-0 text-3xl text-center  outline-none  border-none focus:ring-1 focus:ring-primary-500-main !bg-transparent font-semibold leading-7 text-neutral-800 dark:text-neutral-50',
          }}
        />
        <RHFInputField
          name="thankyou.subtitle"
          formItemProps={{
            className: hasParagraph ? 'w-full px-5' : 'hidden',
          }}
          inputProps={{
            placeholder: 'for submitting our form',
            className:
              'p-2 text-center  outline-none  border-none  !bg-transparent focus:ring-1 focus:ring-primary-500-main rounded-[12px] text-neutral-800 dark:text-neutral-50',
          }}
        />
      </div>
    </div>
  );
};

export default ThankYouForm;
