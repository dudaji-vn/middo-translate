import * as React from 'react';
export const Rectangle = (props: React.SVGAttributes<SVGElement>) => (
  <svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x={2} y={2} width={24} height={24} rx={4} fill="currentColor" />
  </svg>
);
