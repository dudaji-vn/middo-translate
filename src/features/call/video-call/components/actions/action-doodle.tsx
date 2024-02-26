import { DropdownMenuItem } from '@/components/data-display';
import { Brush } from 'lucide-react';
import React from 'react';

export default function ActionDoodle({
  disabled = false,
  onDoodle,
}: {
  disabled?: boolean;
  onDoodle: () => void;
}) {
  return (
    <DropdownMenuItem disabled={disabled} onClick={onDoodle}>
      <Brush />
      <span className="ml-2">Screen Doodle</span>
    </DropdownMenuItem>
  );
}
