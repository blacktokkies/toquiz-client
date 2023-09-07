import type { Panel } from '@/lib/api/panel';
import type { ChangeEvent } from 'react';

import React, { useCallback, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { flushSync } from 'react-dom';

import { Button } from '@/components/system/Button';
import { Spinner } from '@/components/vectors';
import { useSocketClient } from '@/contexts/SocketClientContext';
import { useCreateQuestionMutation } from '@/hooks/queries/question';
import { queryKey } from '@/lib/queryKey';
import { isQuestion } from '@/lib/validator';

interface Props {
  panelId: Panel['sid'];
  close: () => void;
}
export function CreateQuestionModal({ panelId, close }: Props): JSX.Element {
  const socketClient = useSocketClient();
  const queryClient = useQueryClient();
  const createQuestionMutation = useCreateQuestionMutation(panelId, {
    onSuccess: (newQuestion) => {
      queryClient.invalidateQueries(queryKey.question.lists());
      socketClient.publish({
        destination: `/pub/panels/${panelId}`,
        body: JSON.stringify({
          domain: 'question',
          method: 'create',
          ...newQuestion,
        }),
      });
      close();
    },
    onError: () => {
      // 패널 존재하지 않는 경우 패널이 존재하지 않습니다 오류 보여주기
    },
  });

  const [content, setContent] = useState('');
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
        <Button
          type="button"
          variant="secondary"
          onClick={close}
          disabled={createQuestionMutation.isLoading}
        >
          취소
        </Button>
        <Button
          className="min-w-[95px]"
          type="submit"
          disabled={!isQuestion(content) || createQuestionMutation.isLoading}
          onClick={() => {
            createQuestionMutation.mutate({ content: content.trim() });
          }}
        >
          {createQuestionMutation.isLoading ? (
            <Spinner className="animate-spin fill-white mx-auto" />
          ) : (
            '질문 생성'
          )}
        </Button>
      </div>
    </div>
  );
}
