import type { SVGProps } from 'react';

import React from 'react';

export const Emergency = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    width="24"
    height="24"
  >
    <path d="M10.25 21v-5.95L5.1 18.025 3.35 15l5.15-3-5.15-2.975L5.1 6l5.15 2.975V3h3.5v5.975L18.9 6l1.75 3.025L15.5 12l5.15 3-1.75 3.025-5.15-2.975V21Z" />
  </svg>
);
