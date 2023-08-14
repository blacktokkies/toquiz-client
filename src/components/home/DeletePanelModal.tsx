import React from 'react';

interface Props {
  close: () => void;
}
export function DeletePanelModal({ close }: Props): JSX.Element {
  return (
    <div className="flex flex-col p-7 gap-4">
      <h1>패널 삭제하기</h1>
      <button type="button" onClick={close}>
        취소
      </button>
    </div>
  );
}
