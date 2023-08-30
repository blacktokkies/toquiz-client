import React from 'react';

interface Props {
  close: () => void;
}
export function ResignModal({ close }: Props): JSX.Element {
  return (
    <div>
      <h2>회원 탈퇴하기</h2>
      <button type="button" onClick={close}>
        취소
      </button>
    </div>
  );
}
