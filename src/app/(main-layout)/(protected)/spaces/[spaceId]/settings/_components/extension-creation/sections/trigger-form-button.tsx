import React from 'react';
import { BusinessForm } from '@/types/forms.type';
import { Button } from '@/components/actions';
import { FileText } from 'lucide-react';
import Link from 'next/link';

const MessageTriggerForm = ({ name, _id }: Partial<BusinessForm>) => {
  return (
    <div className="relative space-y-2">
      <div className="relative w-fit min-w-10 overflow-hidden rounded-[20px] bg-neutral-50 px-2 py-1">
        <Link href={`/extension-form?formId=${_id}`} target="_blank">
          <Button
            onClick={() => {
              console.log('MessageTriggerForm');
            }}
            className="py-1  hover:underline"
            shape={'square'}
            size={'xs'}
            variant={'ghost'}
            startIcon={<FileText />}
          >
            {name}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MessageTriggerForm;
