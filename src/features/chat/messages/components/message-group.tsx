import { Children, ReactNode, cloneElement, forwardRef } from 'react';

import { cn } from '@/utils/cn';

interface MessageItemGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MessageItemGroup = forwardRef<
  HTMLDivElement,
  MessageItemGroupProps
>((props, ref) => {
  const renderChildrenWithOrder = (children: ReactNode) => {
    return Children.map(children, (child, index) => {
      const length = Children.count(children);
      let order = 'middle';
      if (length === 1) {
        order = 'default';
      } else if (index === 0) {
        order = 'first';
      } else if (index === length - 1) {
        order = 'last';
      }
      const cloneChild = child as React.ReactElement;
      return cloneElement(cloneChild, {
        order,
        ...cloneChild.props,
      });
    });
  };
  return (
    <div
      ref={ref}
      className={cn('flex flex-1 flex-col-reverse gap-0.5', props.className)}
    >
      {props.children && renderChildrenWithOrder(props.children)}
    </div>
  );
});

MessageItemGroup.displayName = 'MessageItemGroup';
