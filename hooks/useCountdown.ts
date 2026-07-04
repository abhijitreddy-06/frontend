import { useState, useEffect } from 'react';
import { Birthday, Countdown } from '../types';
import { calculateCountdown } from '../utils';

export function useCountdown(birthday: Birthday, updateInterval = 1000) {
  const [countdown, setCountdown] = useState<Countdown>(() => calculateCountdown(birthday));

  useEffect(() => {
    const update = () => setCountdown(calculateCountdown(birthday));

    // Update immediately
    update();

    // Set up interval for real-time updates
    const interval = setInterval(update, updateInterval);

    return () => clearInterval(interval);
  }, [birthday, updateInterval]);

  return countdown;
}
