import * as React from 'react';

import { SVGProps } from 'react';

export const CopyImgIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M21 24.5h-7a3.5 3.5 0 0 1-3.5-3.5v-7a3.5 3.5 0 0 1 3.5-3.5h7a3.5 3.5 0 0 1 3.5 3.5v7a3.5 3.5 0 0 1-3.5 3.5Zm-7-11.667A1.167 1.167 0 0 0 12.833 14v7A1.167 1.167 0 0 0 14 22.167h7A1.167 1.167 0 0 0 22.167 21v-7A1.167 1.167 0 0 0 21 12.833h-7Z"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M19.309 18.97a.825.825 0 0 0-1.03-.11l-5.644 3.628-1.27-1.976 5.644-3.629a3.175 3.175 0 0 1 3.962.426l3.36 3.36-1.662 1.662-3.36-3.36Z"
      clipRule="evenodd"
    />
    <path fill="currentColor" d="M15 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    <path
      fill="currentColor"
      d="M11.352 17.5H6.615A3.126 3.126 0 0 1 3.5 14.385v-7.77A3.127 3.127 0 0 1 6.615 3.5h7.77A3.127 3.127 0 0 1 17.5 6.615v4.352h-2.333V6.615a.782.782 0 0 0-.782-.782h-7.77a.782.782 0 0 0-.782.782v7.77a.782.782 0 0 0 .782.782h4.737V17.5Z"
    />
  </svg>
);
