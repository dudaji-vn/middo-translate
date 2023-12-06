import * as React from 'react';

import { SVGProps } from 'react';

export const MessageBubbleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={120}
    height={120}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="#C5DCFA"
        d="M95.35 24.65a50 50 0 0 0-81.4 55 5.3 5.3 0 0 1 .45 3.2L10 104a5.003 5.003 0 0 0 1.35 4.55A4.989 4.989 0 0 0 15 110h1l21.4-4.3a6.294 6.294 0 0 1 3.2.45 49.997 49.997 0 0 0 61.189-17.937A49.998 49.998 0 0 0 95.6 24.75l-.25-.1ZM40 65a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm20 0a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm20 0a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h120v120H0z" />
      </clipPath>
    </defs>
  </svg>
);
