import React from 'react';

interface Props {
  className?: string;
}
export function Backdrop({ className = '' }: Props): JSX.Element {
  return <div className={`fixed inset-0 bg-backdrop ${className}`} />;
}
