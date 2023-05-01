import { useRef, useState, useCallback } from 'react';

/**
 * 요소가 viewport 안에 있는지 감지한다
 * @param `options` IntersectionObserver에 전달할 옵션들
 * @returns `ref` 요소에 붙일 callback ref
 * @returns `inView` 요소가 viewport 안에 있는지 나타내는 boolean 값
 */
const useInView = (
  options?: IntersectionObserverInit,
): [(node: HTMLElement | null) => void, boolean] => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [inView, setInView] = useState(false);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting);
      }, options);

      observer.current.observe(node);
    },
    [options],
  );

  return [ref, inView];
};

export default useInView;
