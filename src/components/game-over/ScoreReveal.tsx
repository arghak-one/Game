import React, { useEffect, useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';

interface ScoreRevealProps {
  score: number;
  isNewBest: boolean;
  onFinished?: () => void;
}

export const ScoreReveal: React.FC<ScoreRevealProps> = ({
  score,
  isNewBest,
  onFinished,
}) => {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [hasSettled, setHasSettled] = useState(false);

  useEffect(() => {
    if (score <= 0) {
      setDisplayedScore(0);
      setHasSettled(true);
      onFinished?.();
      return;
    }

    const duration = 800; // ms
    const startTime = performance.now();

    const updateScore = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeProgress * score);
      setDisplayedScore(current);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      } else {
        setDisplayedScore(score);
        setHasSettled(true);
        onFinished?.();
      }
    };

    const animId = requestAnimationFrame(updateScore);
    return () => cancelAnimationFrame(animId);
  }, [score, onFinished]);

  return (
    <div className="flex flex-col items-center justify-center my-0.5 sm:my-1">
      {/* Header: FINAL SCORE with decorative motifs */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-amber-400 text-xs sm:text-sm drop-shadow">❖</span>
        <span className="text-xs sm:text-sm font-black text-amber-200 tracking-[0.2em] font-festive uppercase drop-shadow">
          FINAL SCORE
        </span>
        <span className="text-amber-400 text-xs sm:text-sm drop-shadow">❖</span>
      </div>

      {/* Large Glowing Gold Number */}
      <div className="relative flex items-center justify-center py-0.5">
        {/* Soft Radial Sunburst Glow Behind the Score */}
        <div
          className={`absolute w-36 h-20 rounded-full bg-amber-500/25 blur-xl pointer-events-none transition-opacity duration-500 ${
            hasSettled ? 'opacity-100 scale-110' : 'opacity-60 scale-95'
          }`}
        />

        <span
          className={`relative z-10 text-4xl sm:text-5xl font-black font-yatra tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-amber-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] transition-transform duration-300 ${
            hasSettled ? 'scale-105' : 'scale-100'
          }`}
        >
          {displayedScore.toLocaleString()}
        </span>
      </div>

      {/* NEW BEST celebratory badge */}
      {isNewBest && hasSettled && (
        <div className="mt-1 inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 border border-yellow-300/80 text-yellow-100 font-black text-[10px] sm:text-xs px-3 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse">
          <Flame className="w-3 h-3 fill-yellow-200" />
          <span>NEW BEST! 🔥</span>
          <Sparkles className="w-3 h-3 text-yellow-200" />
        </div>
      )}
    </div>
  );
};
