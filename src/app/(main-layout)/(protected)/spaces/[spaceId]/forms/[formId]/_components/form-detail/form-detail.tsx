import { BusinessForm } from '@/types/forms.type';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ArrayFields from '../../../_components/form-creation/array-fields';
import { Form } from '@/components/ui/form';
import { cn } from '@/utils/cn';

const FormDetail = ({
  name,
  formFields,
}: Pick<BusinessForm, 'name' | 'formFields'>) => {
  const form = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      name: name,
      customize: {
        layout: 'single',
      },
      thankyou: {
        title: 'Thank you',
        subtitle: 'for submitting our form',
        image: '',
      },
      formFields: formFields || [],
    },
    resolver: zodResolver(z.any()),
  });

  return (
    <div className={cn('flex h-full w-full grow flex-col justify-between ')}>
      <div className={cn('h-0 w-full grow !overflow-y-auto')}>
        <Form {...form}>
          <ArrayFields viewOnly />
        </Form>
      </div>
    </div>
  );
};

export default FormDetail;
