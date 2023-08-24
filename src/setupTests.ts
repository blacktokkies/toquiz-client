import '@testing-library/jest-dom';
import fetch from 'cross-fetch';

import { server } from '@/mocks/server';

globalThis.fetch = fetch;

vi.mock('zustand');

beforeAll(() => {
  server.listen({
    onUnhandledRequest(req) {
      console.warn(
        'Found an unhandled %s request to %s',
        req.method,
        req.url.href,
      );
    },
  });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

/* ===================== [ IntersectionObserver 모킹 ] ===================== */
interface IntersectionObserverEntryMock {
  target: Element;
  isIntersecting: boolean;
}
const storeRemoveFns = new Set<() => void>();
const IntersectionObserverMock = vi.fn(
  (callback: (entries: IntersectionObserverEntryMock[]) => void) => {
    let entries: IntersectionObserverEntryMock[] = [];
    function handleScroll(): void {
      entries.forEach((entry) => {
        entry.isIntersecting = true;
      });
      callback(entries);
    }

    window.addEventListener('scroll', handleScroll);
    storeRemoveFns.add(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      observe: vi.fn((target: Element) => {
        entries = [...entries, { target, isIntersecting: false }];
      }),
      unobserve: vi.fn((target: Element) => {
        entries = entries.filter((entry) => entry.target !== target);
      }),
      disconnect: vi.fn(() => {
        entries = [];
      }),
    };
  },
);
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

afterEach(() => {
  storeRemoveFns.forEach((removeFn) => {
    removeFn();
  });
});
