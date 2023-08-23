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
    </div>
  );
}
