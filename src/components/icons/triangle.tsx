import * as React from 'react';

import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & {
  position?: 'top' | 'bottom';
};
export const Triangle = ({ position = 'top', ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={8}
    fill="none"
    {...props}
  >
    {position === 'top' ? (
      <path
        fill="#F1F1F1"
        d="M4.501 1.248a1 1 0 0 1 1.664 0L10.667 8H0l4.501-6.752Z"
      />
    ) : (
      <path
        fill="#F1F1F1"
        d="M4.501 6.752a1 1 0 0 0 1.664 0L10.667 0H0l4.501 6.752Z"
      />
    )}
  </svg>
);
