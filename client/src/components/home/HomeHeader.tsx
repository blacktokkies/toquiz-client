import React from 'react';

import LogoHeader from '@/components/base/LogoHeader';
import { Search, Account } from '@/components/vectors';

const HomeHeader = (): JSX.Element => (
  <LogoHeader to="/main">
    <ul className="flex items-center gap-2">
      <li>
        <button type="button" className="hover:bg-grey-light rounded-full p-2">
          <Search className="fill-primary-dark" />
        </button>
      </li>
      <li>
        <button type="button" className="hover:bg-grey-light rounded-full p-2">
          <Account className="fill-primary-dark" />
        </button>
      </li>
    </ul>
  </LogoHeader>
);

export default HomeHeader;
