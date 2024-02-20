import { Button } from '@/components/actions';
import { ROUTE_NAMES } from '@/configs/route-name';
import { HistoryIcon, SparkleIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';

export interface ExtensionProps {}

// TODO: Add shortcut to open history and phrases after the feature is implemented
const SHORTCUT_HISTORY = ['h'];
const SHORTCUT_PHRASES = ['p'];

export const Extension = (props: ExtensionProps) => {
  return (
    <div className="flex w-full justify-end gap-2 px-[5vw]">
      <Button
        shape="square"
        color="default"
        size="xs"
        startIcon={<HistoryIcon />}
      >
        History
      </Button>
      <Button
        shape="square"
        color="default"
        size="xs"
        startIcon={<SparklesIcon />}
      >
        Phrases
      </Button>
    </div>
  );
};
