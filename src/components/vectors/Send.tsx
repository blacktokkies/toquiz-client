import type { SVGProps } from 'react';

import React from 'react';

export const Send = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="48"
    viewBox="0 -960 960 960"
    width="48"
    {...props}
  >
    <path d="M120-160v-640l760 320-760 320Zm60-93 544-227-544-230v168l242 62-242 60v167Zm0 0v-457 457Z" />
  </svg>
);
