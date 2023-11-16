'use client';

import { CopyOutline } from '@easy-eva-icons/react';
import { IconButton } from '@/components/button';
import { Section } from './section';
import { useTextCopy } from '@/hooks/use-text-copy';

export interface SideChatHeaderProps {
  code: string;
}

export const SideChatHeader = (props: SideChatHeaderProps) => {
  const { copy } = useTextCopy(props.code);
  return (
    <div className="bg-background">
      <Section title="Code: ">
        <div className="flex items-center justify-between py-3">
          <h4 className="text-primary">{props.code}</h4>
          <IconButton variant="ghost">
            <CopyOutline className="opacity-60" onClick={() => copy()} />
          </IconButton>
        </div>
      </Section>
    </div>
  );
};
