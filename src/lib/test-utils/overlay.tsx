import type { RenderResult } from '@testing-library/react';
import type React from 'react';

import { render } from '@testing-library/react';

import { OverlayProvider } from '@/contexts/OverlayContext';

export function renderWithOverlay(ui: React.ReactElement): RenderResult {
  return render(ui, { wrapper: OverlayProvider });
}
