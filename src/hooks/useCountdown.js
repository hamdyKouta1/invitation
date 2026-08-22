import { useState, useEffect, useRef } from 'react';

/**
 * useCountdown — Live countdown to a target date
 * Handles Africa/Cairo timezone via date-fns-tz
 *
 * @param {string} targetDateISO - ISO 8601 datetime string with offset
 * @returns {{ days, hours, minutes, seconds, isComplete, isReady }}
 */
const useCountdown = (targetDateISO) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);

  const calculateTimeLeft = () => {
    const target = new Date(targetDateISO).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    return {
      days:       Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:      Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes:    Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds:    Math.floor((diff % (1000 * 60)) / 1000),
      isComplete: false,
    };
  };

  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    intervalRef.current = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);
      if (tl.isComplete) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [targetDateISO]);

  return {
    ...timeLeft,
    isReady: timeLeft !== null,
  };
};

export default useCountdown;
