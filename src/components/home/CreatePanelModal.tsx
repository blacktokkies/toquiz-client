import React from 'react';

import { LabelInput } from '../system/LabelInput';

interface Props {
  close: () => void;
}
export function CreatePanelModal({ close }: Props): JSX.Element {
  return (
    <div>
      <h2>패널 생성하기</h2>
      <form aria-label="패널 생성" onSubmit={close}>
        <LabelInput label="패널 제목" />
        <LabelInput label="패널 설명" />
        <button
          type="button"
          onClick={() => {
            close();
          }}
        >
          취소
        </button>
        <button type="submit">패널 생성</button>
      </form>
    </div>
  );
}
