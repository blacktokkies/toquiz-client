import { useEffect, useState } from 'react';

export function useCurrentDate(delay = 1000): Date {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, [delay]);

  return currentDate;
}
