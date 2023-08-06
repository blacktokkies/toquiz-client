import '@testing-library/jest-dom';
import fetch from 'cross-fetch';

import { server } from '@/mocks/server';

globalThis.fetch = fetch;

const IntersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

afterEach(() => {
  vi.clearAllMocks();
});
