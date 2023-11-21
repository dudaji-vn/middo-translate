import * as React from 'react';

import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & {
  position?: 'top' | 'bottom';
};
export const TriangleSmall = ({ position = 'top', ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={4}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || '#F2F2F2'}
      d="M4.733.45a1 1 0 0 1 1.2 0L10.667 4H0L4.733.45Z"
    />
  </svg>
);
