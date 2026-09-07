import { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';

export interface ToastProgressProps {
  progressColor: string;
  duration: number;
}

export const ToastProgress = ({
  progressColor,
  duration,
}: ToastProgressProps) => {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={cn('absolute bottom-0 left-0 h-[3px]', progressColor)}
      style={{
        width: started ? '0%' : '100%',
        transition: `width ${duration}ms linear`,
      }}
    />
  );
};
