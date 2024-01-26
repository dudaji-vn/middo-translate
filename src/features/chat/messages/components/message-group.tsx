import { Children, ReactNode, cloneElement, forwardRef } from 'react';

import { cn } from '@/utils/cn';

export type Direction = 'bottom' | 'top';
interface MessageItemGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Direction;
}

export const MessageItemGroup = forwardRef<
  HTMLDivElement,
  MessageItemGroupProps
>(({ direction = 'bottom', ...props }, ref) => {
  const renderChildrenWithOrder = (
    children: ReactNode,
    direction: Direction,
  ) => {
    return Children.map(children, (child, index) => {
      const length = Children.count(children);
      let order = 'middle';
      switch (direction) {
        case 'bottom':
          if (length === 1) {
            order = 'default';
          } else if (index === 0) {
            order = 'first';
          } else if (index === length - 1) {
            order = 'last';
          }
          break;
        case 'top':
          if (length === 1) {
            order = 'default';
          } else if (index === 0) {
            order = 'last';
          } else if (index === length - 1) {
            order = 'first';
          }
          break;
      }

      const cloneChild = child as React.ReactElement;
      return cloneElement(cloneChild, {
        direction,
        order,
        ...cloneChild.props,
      });
    });
  };
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-1 gap-1',
        direction === 'bottom' ? 'flex-col-reverse' : 'flex-col',
        props.className,
      )}
    >
      {props.children && renderChildrenWithOrder(props.children, direction)}
    </div>
  );
});

MessageItemGroup.displayName = 'MessageItemGroup';
