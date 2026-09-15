import React from 'react';
import { Pause, Shield, Sparkles } from 'lucide-react';
import { GameStats } from '../types';

interface HUDProps {
  stats: GameStats;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({ stats, onPause }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full gap-2 sm:gap-4 md:gap-6 pointer-events-auto">
        {/* Score & Distance */}
        <div className="bg-neutral-950/75 backdrop-blur-md border border-amber-500/40 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 flex flex-col shadow-lg shadow-black/40">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-xs sm:text-sm md:text-base font-semibold tracking-wider text-amber-300/80 uppercase">Score</span>
            <span className="text-xl sm:text-2xl md:text-3xl font-black text-amber-400 font-yatra drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {stats.score.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] sm:text-xs md:text-sm text-amber-100/70 flex items-center gap-2 font-medium">
            <span>{stats.distance.toLocaleString()} m</span>
            <span className="text-amber-500/60">•</span>
            <span className="text-amber-400/90 font-semibold">Best: {stats.bestScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Center: Festival / Utsav Meter */}
        <div className="flex-1 max-w-[200px] sm:max-w-[280px] md:max-w-[340px] flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className={`w-3.5 h-3.5 md:w-4 md:h-4 ${stats.isMahotsav ? 'text-yellow-300 animate-spin' : 'text-amber-400'}`} />
            <span className={`text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase ${stats.isMahotsav ? 'text-yellow-300 font-yatra animate-pulse' : 'text-amber-200'}`}>
              {stats.isMahotsav ? '✨ MAHOTSAV MODE! ✨' : 'UTSAV METER'}
            </span>
          </div>
          
          <div className="w-full h-3.5 sm:h-4 md:h-5 bg-neutral-950/80 border border-amber-500/50 rounded-full p-0.5 overflow-hidden shadow-inner relative">
            <div
              className={`h-full rounded-full transition-all duration-200 relative overflow-hidden ${
                stats.isMahotsav
                  ? 'bg-gradient-to-r from-yellow-400 via-amber-300 to-rose-500 animate-shimmer shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                  : 'bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-400'
              }`}
              style={{
                width: stats.isMahotsav
                  ? `${Math.max(0, Math.min(100, (stats.mahotsavTimeLeft / 12) * 100))}%`
                  : `${stats.festivalMeter}%`,
              }}
            />
          </div>
        </div>

        {/* Right: Modaks & Pause Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Modak Count */}
          <div className="bg-neutral-950/75 backdrop-blur-md border border-amber-500/40 rounded-2xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 md:px-4 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-lg shadow-black/40">
            {/* Mini Modak SVG icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]" fill="none">
              <path
                d="M12 2C16 8 20 13 18 19C17 21 15 22 12 22C9 22 7 21 6 19C4 13 8 8 12 2Z"
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              <path d="M12 2V22M12 2C14 8 16 14 15 21M12 2C10 8 8 14 9 21" stroke="#d97706" strokeWidth="1" />
            </svg>
            <span className="text-base sm:text-xl md:text-2xl font-bold text-amber-300 font-yatra">
              {stats.modaks}
            </span>
          </div>

          {/* Pause Button */}
          <button
            id="hud-pause-btn"
            onClick={onPause}
            className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-neutral-900/80 hover:bg-neutral-800 active:scale-95 transition-transform border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-300 shadow-lg cursor-pointer"
            aria-label="Pause Game"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-amber-300/30" />
          </button>
        </div>
      </div>

      {/* Floating Status Badges (Left & Center) */}
      <div className="flex items-end justify-between w-full pb-16 sm:pb-8">
        {/* Left Side: Jump Charges & Location */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          {/* Jumps Indicator */}
          <div className="bg-neutral-950/70 backdrop-blur-md border border-amber-500/30 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center gap-2 sm:gap-2.5">
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider text-amber-200/80">
              JUMP
            </span>
            <div className="flex gap-1.5 sm:gap-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full transition-all duration-150 ${
                    num <= stats.jumpsRemaining
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-110'
                      : 'bg-neutral-700/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Shield Status */}
          {stats.hasShield && (
            <div className="bg-amber-500/20 backdrop-blur-md border border-amber-400/80 rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1.5 animate-pulse text-amber-200 text-xs sm:text-sm font-bold shadow-[0_0_12px_rgba(251,191,36,0.5)]">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300" />
              <span>SHIELD ACTIVE</span>
            </div>
          )}
        </div>

        {/* Right Side: Combo Badge */}
        {stats.comboMultiplier > 1 && (
          <div className="bg-gradient-to-r from-amber-600/90 to-rose-600/90 backdrop-blur-md border-2 border-yellow-300 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 text-center shadow-xl shadow-amber-950/60 animate-bounce">
            <div className="text-[10px] sm:text-xs md:text-sm font-bold tracking-widest text-amber-200 uppercase">
              {stats.comboMultiplier >= 8 ? 'SUPER COMBO' : 'COMBO'}
            </div>
            <div className="text-xl sm:text-3xl md:text-4xl font-black text-yellow-300 font-yatra drop-shadow-md">
              ×{stats.comboMultiplier}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
