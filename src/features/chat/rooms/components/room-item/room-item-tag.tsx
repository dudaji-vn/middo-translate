import React from 'react';
import { Room } from '../../types';
import { Badge } from '@/components/ui/badge';
import { getContrastingTextColor } from '@/utils/color-generator';
import { cn } from '@/utils/cn';

const RoomItemTag = ({ tag }: { tag: Room['tag'] }) => {
  if (!tag?.name) {
    return null;
  }
  return (
    <Badge
      variant="default"
      className={cn('line-clamp-1 max-w-40 capitalize', {
        hidden: !tag?.name,
      })}
      style={{
        backgroundColor: tag?.color,
        color: getContrastingTextColor(tag?.color),
      }}
    >
      {tag?.name}
    </Badge>
  );
};

export default RoomItemTag;
