import type { ReactNode } from 'react';
import type { LinkProps } from 'react-router-dom';

import React from 'react';

import { Link } from 'react-router-dom';

import { Logo } from '@/components/vectors';

interface Props {
  to: LinkProps['to'];
  children?: ReactNode;
}

const LogoHeader = ({ to, children }: Props): JSX.Element => (
  <header className="bg-white shadow-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center px-5 ">
      <Link
        to={to}
        className="hover:bg-grey-light rounded-full hover:shadow-lg"
      >
        <Logo className="h-14 w-14" />
      </Link>
      <div className="flex h-full flex-1 items-center justify-end">
        {children}
      </div>
    </div>
  </header>
);

export default LogoHeader;
