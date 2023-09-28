import { useEffect, useState } from 'react';

export function useCurrentDate({ delay = 1000, start = new Date() }): Date {
  const [currentDate, setCurrentDate] = useState(start);

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
