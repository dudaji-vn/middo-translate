import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/actions';
import { Plus, Trash2 } from 'lucide-react';
import { Typography } from '@/components/data-display';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { cn } from '@/utils/cn';

const AddingDomainsStep = () => {
  const {
    trigger,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useFormContext();

  const domains: Array<string> = watch('domains');
  const addingDomain: string = watch('addingDomain');
  const domainsErrMessage = errors?.domains?.message || '';

  const addDomain = () => {
    if (!addingDomain || domains?.includes(addingDomain)) return;
    const newDomains = Array.from(new Set([...domains, addingDomain]));
    setValue('domains', newDomains);
    setValue('addingDomain', '');
    trigger('domains');
  };

  const removeDomain = (domain: string) => {
    setValue(
      'domains',
      domains.filter((d) => d !== domain),
    );
    trigger('domains');
  };

  return (
    <>
      <div className="flex  flex-col gap-3 p-4 ">
        <Typography
          variant="h5"
          className=" flex flex-col gap-3 text-[1rem]  text-neutral-800 dark:text-neutral-50"
        >
          <span className="font-semibold">Add domain</span>
          <span className="font-normal text-neutral-600 dark:text-neutral-50">
            Add all of your website domains that you would like the extension to
            appear on.
          </span>
        </Typography>
        <div className="flex w-full flex-row items-start justify-between gap-3">
          <RHFInputField
            name="addingDomain"
            inputProps={{
              placeholder: 'https://example.com',
              className: 'h-10',
            }}
            formItemProps={{
              className: 'w-full',
            }}
          />
          <Button
            color="secondary"
            shape="square"
            type="button"
            className="h-10"
            onClick={addDomain}
            disabled={Boolean(errors.addingDomain) || isSubmitting}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col p-4">
        {domains?.length > 0 && (
          <p
            className="inline-block text-[1rem] font-semibold text-neutral-800 dark:text-neutral-50"
          >
            Added domains
          </p>
        )}
        <Typography
          className={
            domainsErrMessage && !isValid
              ? 'inline-block py-1 text-[1rem] font-normal text-red-500'
              : 'hidden'
          }
        >
          {domainsErrMessage as string}
        </Typography>
        {domains?.map((domain, index) => {
          if (!domain?.length) {
            removeDomain(domain);
            return null;
          }
          return (
            <div
              key={index}
              className={cn(
                'flex w-full flex-row items-center justify-between gap-4 border-b border-neutral-50 dark:border-neutral-800 py-3 last:border-b-0',
              )}
            >
              <Typography className="text-[1rem] font-normal text-neutral-600 dark:text-neutral-50 line-clamp-1 max-w-full truncate text-ellipsis">
                {domain}
              </Typography>
              <Button
                variant="ghost"
                color="error"
                shape="square"
                type="button"
                size={'xs'}
                onClick={() => removeDomain(domain)}
                disabled={isSubmitting}
              >
                <Trash2 />
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AddingDomainsStep;
