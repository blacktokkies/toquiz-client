import React from 'react';

import { Link } from 'react-router-dom';

import Button from '@/components/Button';
import LabelInput from '@/components/LabelInput';

function Signup(): JSX.Element {
  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center px-9">
      <div className="mb-14 text-3xl font-bold">toquiz</div>
      <form className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-5">
          <LabelInput
            label="아이디"
            id="id"
            required
            placeholder="아이디를 입력하세요"
          />
          <LabelInput
            label="비밀번호"
            id="password"
            type="password"
            required
            placeholder="비밀번호를 입력하세요"
          />
          <LabelInput
            label="비밀번호 확인"
            id="confirm-password"
            type="password"
            required
            placeholder="비밀번호를 다시 입력하세요"
          />
          <LabelInput
            label="닉네임"
            id="username"
            required
            placeholder="닉네임을 입력하세요"
          />
        </div>
        <Button className="w-full">회원가입</Button>
      </form>
      <div className="mt-2">
        계정이 있나요?{' '}
        <Link className="font-bold underline" to="/login">
          로그인
        </Link>
      </div>
    </div>
  );
}

export default Signup;
