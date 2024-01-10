import * as React from 'react';

import { SVGProps } from 'react';

export const BellOffIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="currentColor"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#a)">
      <path d="M8.5 8.5h-7S3 7.5 3 4c-.003-.29.048-.579.15-.85" />
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M3.326 2.682a.5.5 0 0 1 .292.644c-.08.214-.12.44-.118.668V4c0 1.824-.391 3.033-.811 3.802A4.71 4.71 0 0 1 2.575 8H8.5a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.283-.912l.001-.001a1.51 1.51 0 0 0 .153-.142c.113-.118.274-.318.44-.622.33-.605.689-1.646.689-3.32-.004-.352.058-.7.182-1.03a.5.5 0 0 1 .644-.29ZM1.222 8.085ZM4.91 10.062a.5.5 0 0 1 .678.197.47.47 0 0 0 .824 0 .5.5 0 1 1 .876.482 1.47 1.47 0 0 1-2.576 0 .5.5 0 0 1 .197-.68Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M.646.646a.5.5 0 0 1 .708 0l10 10a.5.5 0 0 1-.708.708l-10-10a.5.5 0 0 1 0-.708Z"
        clipRule="evenodd"
      />
      <path d="M4.35 1.5A3 3 0 0 1 9 4c0 .842.102 1.681.3 2.5" />
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M7.184 1.803a2.5 2.5 0 0 0-1.992-.163l3.357 3.39A11.148 11.148 0 0 1 8.5 4H9h-.5a2.5 2.5 0 0 0-1.316-2.197ZM5.844.51A3.5 3.5 0 0 1 9.5 3.999c0 .803.097 1.603.286 2.383a.5.5 0 0 1-.841.47l-4.95-5a.5.5 0 0 1 .08-.77A3.5 3.5 0 0 1 5.845.51Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="currentColor" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
);
