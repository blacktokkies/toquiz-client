import React from 'react';

import { ArrowBack } from '@/components/vectors';

interface Props {
  close: () => void;
}
export function QAModal({ close }: Props): JSX.Element {
  return (
    <div
      role="dialog"
      aria-label="질문과 답변 모달"
      className="fixed inset-0 bg-white"
    >
      <header className="flex justify-start items-center bg-primary-dark shadow-md px-3 h-16">
        <button type="button" className="rounded-full p-1" onClick={close}>
          <ArrowBack className="fill-white" />
          <span className="sr-only">뒤로 가기</span>
        </button>
      </header>
    </div>
  );
}
