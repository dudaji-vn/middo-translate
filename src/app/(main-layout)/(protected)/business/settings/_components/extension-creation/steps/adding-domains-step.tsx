import React from 'react'
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/actions';
import { Plus, Trash2 } from 'lucide-react';
import { Typography } from '@/components/data-display';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { cn } from '@/utils/cn';

const AddingDomainsStep = () => {
  const { trigger, watch, setValue, formState: {
    errors,
    isValid,
    isSubmitting,
  } } = useFormContext();


  const domains: Array<string> = watch('domains');
  const addingDomain: string = watch('addingDomain');
  const domainsErrMessage = errors?.domains?.message || '';

  const addDomain = () => {
    if (!addingDomain || domains?.includes(addingDomain)) return;
    const newDomains = Array.from(new Set([...domains, addingDomain]));
    setValue('domains', newDomains);
    setValue('addingDomain', '');
    trigger('domains');
  }

  const removeDomain = (domain: string) => {
    setValue('domains', domains.filter((d) => d !== domain));
    trigger('domains');
  }

  return (
    <>
      <Typography variant="h5" className="inline-block py-3 text-neutral-600 text-[1rem] font-normal">
        Add all domains that you would like the extension to appear on
      </Typography>
      <div className='flex flex-row gap-3 items-start w-full justify-between'>
        <RHFInputField
          name='addingDomain'
          inputProps={{
            placeholder: 'https://example.com',
            className: 'h-10'
          }}
          formItemProps={{
            className: 'w-full',
          }}
        />
        <Button
          color="secondary"
          shape="square"
          type="button"
          className='h-10'
          onClick={addDomain}
          disabled={Boolean(errors.addingDomain) || isSubmitting}

        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      {domains?.length > 0 && <Typography variant="h5" className="inline-block py-3 text-neutral-600 text-[1rem] font-medium">Added domains</Typography>}
      {domains?.map((domain, index) => {
        if (!domain?.length) {
          removeDomain(domain);
          return null;
        }
        return (
          <div key={index} className={cn('flex flex-row items-center gap-4 w-full justify-between')}>
            <Typography className="text-neutral-600 text-[1rem] font-normal">
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
      })
      }
      <Typography className={domainsErrMessage && !isValid ? "inline-block py-1 text-red-500 text-[1rem] font-normal" : 'hidden'}>{domainsErrMessage as string}</Typography>
    </>
  )
}

export default AddingDomainsStep