import React, { useState } from 'react';
import { RotateCcw, Trophy, Home } from 'lucide-react';
import { SoundManager } from '../../audio/SoundManager';

interface GameOverActionsProps {
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
  onHome: () => void;
}

export const GameOverActions: React.FC<GameOverActionsProps> = ({
  onPlayAgain,
  onOpenLeaderboard,
  onHome,
}) => {
  const [isPressingPlay, setIsPressingPlay] = useState(false);
  const sound = SoundManager.getInstance();

  const handlePlayAgain = () => {
    setIsPressingPlay(true);
    sound.playButtonClick();
    sound.playMahotsavStart();
    setTimeout(() => {
      onPlayAgain();
    }, 180);
  };

  const handleLeaderboard = () => {
    sound.playButtonClick();
    onOpenLeaderboard();
  };

  const handleHome = () => {
    sound.playButtonClick();
    onHome();
  };

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-2.5 mt-1 sm:mt-1.5">
      {/* Primary Big CTA: PLAY AGAIN */}
      <button
        id="gameover-playagain-btn"
        onClick={handlePlayAgain}
        className={`w-full py-3 sm:py-3.5 px-4 rounded-full gold-embossed-button border-2 border-yellow-200 text-neutral-950 font-black text-lg sm:text-xl font-festive tracking-widest uppercase cursor-pointer flex items-center justify-between shadow-lg relative overflow-hidden transition-all duration-200 animate-breathing-cta ${
          isPressingPlay ? 'scale-95 brightness-110' : 'hover:brightness-105 active:scale-95'
        }`}
      >
        {/* Shimmer Sweep Animation Overlay */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />

        {/* Left Lotus Motif */}
        <span className="text-xl sm:text-2xl filter drop-shadow relative z-10 pl-1">
          🪷
        </span>

        {/* Center: Replay Icon + Text */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-950/20 flex items-center justify-center border border-amber-900/40 shadow-inner">
            <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neutral-950 stroke-[2.5]" />
          </div>
          <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-amber-950 font-black tracking-wider text-base sm:text-lg">
            PLAY AGAIN
          </span>
        </div>

        {/* Right Lotus Motif */}
        <span className="text-xl sm:text-2xl filter drop-shadow relative z-10 pr-1">
          🪷
        </span>
      </button>

      {/* Secondary Buttons Row: Ranks & Home */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        <button
          id="gameover-ranks-btn"
          onClick={handleLeaderboard}
          className="py-2 sm:py-2.5 px-3 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 active:scale-95 text-amber-200 text-xs sm:text-sm font-bold font-festive border border-amber-500/40 flex items-center justify-center gap-1.5 shadow-md shadow-black/50 backdrop-blur-sm cursor-pointer transition-all hover:border-amber-400"
        >
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          <span>Ranks</span>
        </button>

        <button
          id="gameover-home-btn"
          onClick={handleHome}
          className="py-2 sm:py-2.5 px-3 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 active:scale-95 text-amber-200 text-xs sm:text-sm font-bold font-festive border border-amber-500/40 flex items-center justify-center gap-1.5 shadow-md shadow-black/50 backdrop-blur-sm cursor-pointer transition-all hover:border-amber-400"
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          <span>Home</span>
        </button>
      </div>
    </div>
  );
};
