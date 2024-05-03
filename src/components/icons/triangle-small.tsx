import * as React from 'react';

import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & {
  position?: 'top' | 'bottom';
  pathProps?: SVGProps<SVGPathElement>;
};
export const TriangleSmall = ({
  position = 'top',
  pathProps,
  ...props
}: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={4}
    height={3}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || '#F2F2F2'}
      d="M1.16795 1.24807C1.56377 0.654342 2.43623 0.654342 2.83205 1.24808L4 3H0L1.16795 1.24807Z"
      {...pathProps}
    />
  </svg>
);
