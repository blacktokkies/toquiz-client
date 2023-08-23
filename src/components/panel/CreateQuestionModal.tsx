import type { Panel } from '@/lib/api/panel';

import React, { useState } from 'react';

import { useCreateQuestionMutation } from '@/hooks/queries/question';

interface Props {
  panelId: Panel['id'];
  close: () => void;
}
export function CreateQuestionModal({ panelId, close }: Props): JSX.Element {
  const [content, setContent] = useState('');
  const createQuestionMutation = useCreateQuestionMutation(panelId);

  function handleSubmit(): void {
    createQuestionMutation.mutate(
      {
        content,
      },
      {
        onSuccess: () => {
          close();
        },
        onError: () => {
          // 패널 존재하지 않는 경우 패널이 존재하지 않습니다 오류 보여주기
        },
      },
    );
  }

  return (
    <div>
      <span>{content.length}자</span>
      <input
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <button
        type="submit"
        disabled={
          content.length === 0 ||
          content.length > 200 ||
          createQuestionMutation.isLoading
        }
        onClick={handleSubmit}
      >
        질문 생성
      </button>
    </div>
  );
}
