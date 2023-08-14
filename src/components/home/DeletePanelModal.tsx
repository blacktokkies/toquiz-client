import React from 'react';

interface Props {
  close: () => void;
}
export function DeletePanelModal({ close }: Props): JSX.Element {
  return (
    <div>
      <button type="button" onClick={close}>
        취소
      </button>
    </div>
  );
}
