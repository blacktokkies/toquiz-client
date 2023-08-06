import React from 'react';

interface Props {
  transparent?: boolean;
}
export function Backdrop({ transparent = false }: Props): JSX.Element {
  return (
    <div
      className={`fixed inset-0 ${transparent ? 'opacity-0' : 'bg-backdrop'}`}
    />
  );
}
