import React, { useState } from 'react';

export function CreateQuestionModal(): JSX.Element {
  const [content, setContent] = useState('');

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
        disabled={content.length === 0 || content.length > 200}
      >
        질문 생성
      </button>
    </div>
  );
}
