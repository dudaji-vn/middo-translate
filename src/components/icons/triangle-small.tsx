import * as React from 'react';

import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & {
  position?: 'top' | 'bottom';
};
export const TriangleSmall = ({ position = 'top', ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={6}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || '#F2F2F2'}
      d="M3.168 1.248a1 1 0 011.664 0L8 6H0l3.168-4.752z"
    />
  </svg>
);
