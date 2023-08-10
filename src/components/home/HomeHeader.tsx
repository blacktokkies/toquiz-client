import React from 'react';

import { Link } from 'react-router-dom';

import { AccountActionMenu } from '@/components/home/AccountActionMenu';
import { OpenActionMenuArea } from '@/components/system/OpenActionMenuArea';
import { Logo, Account } from '@/components/vectors';

export function HomeHeader(): JSX.Element {
  return (
    <header className="bg-white shadow-md">
      <div className="container flex justify-between items-center max-w-7xl px-5 h-16">
        <Link
          to="/home"
          className="hover:bg-grey-light rounded-full hover:shadow-lg"
        >
          <div role="img" aria-label="toquiz 로고">
            <Logo className="h-11 w-11" />
          </div>
        </Link>
        <OpenActionMenuArea
          ariaLabel="내 계정 액션 메뉴"
          open={({ close }) => <AccountActionMenu close={close} />}
        >
          <button
            type="button"
            className="hover:bg-grey-light rounded-full p-2"
            aria-label="내 계정 아이콘"
          >
            <div role="img" aria-label="내 계정 아이콘">
              <Account className="fill-grey-darkest" />
            </div>
          </button>
        </OpenActionMenuArea>
      </div>
    </header>
  );
}
