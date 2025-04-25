import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  initialMinutes?: number;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes = 60 }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds]);
  
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Change color based on remaining time
  const getTimerColor = () => {
    if (seconds < 300) { // Less than 5 minutes
      return 'text-red-500 dark:text-red-400';
    } else if (seconds < 600) { // Less than 10 minutes
      return 'text-yellow-500 dark:text-yellow-400';
    }
    return 'text-cyan-600 dark:text-cyan-400';
  };
  
  return (
    <div className="flex items-center gap-1.5">
      <Clock size={16} className={getTimerColor()} />
      <span className={`font-mono ${getTimerColor()}`}>
        {formatTime(seconds)}
      </span>
    </div>
  );
};

export default Timer;