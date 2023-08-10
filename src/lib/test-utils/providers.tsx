import type { RenderResult } from '@testing-library/react';

import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

import { OverlayProvider } from '@/contexts/OverlayContext';

import { createQueryClient } from './react-query';

export function renderWithAllProviders(ui: React.ReactElement): RenderResult {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <OverlayProvider>{ui}</OverlayProvider>
    </QueryClientProvider>,
  );
}
