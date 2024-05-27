import { Button } from '@/components/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { ChevronDown } from 'lucide-react';
import React from 'react';
const topsOptions = [3, 5, 10, 15, 20];

export const SelectLimitNumber = ({
  value = topsOptions[0],
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row items-center gap-2 border-none bg-transparent px-3 py-2 font-semibold text-neutral-700">
        Top&nbsp;
        {value}
        <Button.Icon size="xs" variant="ghost" color="default">
          <ChevronDown className="size-4" />
        </Button.Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {topsOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => {}}
            className="flex flex-row gap-2 capitalize text-neutral-600"
            onClick={() => onChange(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
