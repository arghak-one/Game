import React, { useEffect, useState } from 'react';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number | string>(3);

  useEffect(() => {
    const timer1 = setTimeout(() => setCount(2), 700);
    const timer2 = setTimeout(() => setCount(1), 1400);
    const timer3 = setTimeout(() => setCount('JAI GANESHA!'), 2100);
    const timer4 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] select-none pointer-events-none">
      <div className="text-center animate-bounce">
        <div className="text-6xl sm:text-8xl font-black font-festive text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 drop-shadow-[0_10px_25px_rgba(245,158,11,0.8)]">
          {count}
        </div>
        <div className="text-amber-200/90 text-sm sm:text-base font-semibold tracking-widest uppercase mt-3">
          Get Ready to Leap!
        </div>
      </div>
    </div>
  );
};
