import type { Panel } from '@/lib/api/panel';
import type { ChangeEvent } from 'react';

import React, { useCallback, useRef, useState } from 'react';

import { flushSync } from 'react-dom';

import { Button } from '@/components/system/Button';
import { useCreateQuestionMutation } from '@/hooks/queries/question';

interface Props {
  panelId: Panel['sid'];
  close: () => void;
}
export function CreateQuestionModal({ panelId, close }: Props): JSX.Element {
  const [content, setContent] = useState('');
  const createQuestionMutation = useCreateQuestionMutation(panelId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaRefCallback = useCallback(
    (node: HTMLTextAreaElement | null) => {
      if (node) {
        textareaRef.current = node;
        textareaRef.current.focus();
      }
    },
    [],
  );

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

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    flushSync(() => {
      setContent(e.target.value);
    });

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  return (
    <div className="flex flex-col p-5">
      <span className="ml-auto text-grey-dark">
        <span className={content.length > 200 ? 'text-danger' : 'text-inherit'}>
          {content.length}
        </span>
        /200자
      </span>
      <textarea
        ref={textareaRefCallback}
        className="rounded-md outline-none resize-none overflow-hidden focus:bg-off-white mt-2 mb-6 p-1"
        placeholder="실시간으로 질문해보세요!"
        value={content}
        onChange={handleChange}
      />
      <div className="flex gap-4 justify-end items-center">
        <Button type="button" variant="secondary" onClick={close}>
          취소
        </Button>
        <Button
          type="submit"
          disabled={
            content.length === 0 ||
            content.length > 200 ||
            createQuestionMutation.isLoading
          }
          onClick={handleSubmit}
        >
          질문 생성
        </Button>
      </div>
    </div>
  );
}
