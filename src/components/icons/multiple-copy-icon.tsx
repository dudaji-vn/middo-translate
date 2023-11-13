import * as React from 'react';

import { SVGProps } from 'react';

export const MultipleCopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M17 9.35h-6A1.65 1.65 0 0 0 9.35 11v6c0 .911.739 1.65 1.65 1.65h6A1.65 1.65 0 0 0 18.65 17v-6A1.65 1.65 0 0 0 17 9.35ZM11 7a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-6a4 4 0 0 0-4-4h-6Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M7 5.35h6c.911 0 1.65.739 1.65 1.65H17a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4v-2.35A1.65 1.65 0 0 1 5.35 13V7c0-.911.739-1.65 1.65-1.65ZM13.35 21H11a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-6a4 4 0 0 0-4-4v2.35c.911 0 1.65.739 1.65 1.65v6A1.65 1.65 0 0 1 21 22.65h-6A1.65 1.65 0 0 1 13.35 21Z"
    />
  </svg>
);
