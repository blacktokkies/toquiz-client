import React from 'react';

import { Link } from 'react-router-dom';

import { AccountActionMenu } from '@/components/home/AccountActionMenu';
import { OpenActionMenuArea } from '@/components/system/OpenActionMenuArea';

/* eslint-disable import/no-absolute-path */
import Icons from '/icons.svg?url';

export function HomeHeader(): JSX.Element {
  return (
    <header className="bg-white shadow-md">
      <div className="container flex justify-between items-center max-w-7xl px-5 h-16">
        <Link to="/home" className="rounded-full">
          <img src="/Logo.png" className="h-11 w-11" alt="toquiz 로고" />
        </Link>
        <OpenActionMenuArea
          aria-label="내 계정 액션 메뉴"
          open={({ close }) => <AccountActionMenu close={close} />}
        >
          <button
            type="button"
            className="hover:bg-grey-light rounded-full p-2"
          >
            <svg className="w-6 h-6 text-grey-darkest">
              <use href={`${Icons}#account`} />
            </svg>
            <span className="sr-only">내 계정 아이콘</span>
          </button>
        </OpenActionMenuArea>
      </div>
    </header>
  );
}
