import React from 'react';
import { Play, RotateCcw, Home, Settings, BookOpen } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  onOpenSettings,
  onOpenTutorial,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-neutral-900/95 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-festive text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-400 mb-1">
          PAUSED
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/70 mb-6">Take a breath in the sacred festivities</p>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 sm:gap-4">
          {/* Resume */}
          <button
            id="pause-resume-btn"
            onClick={onResume}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-bold text-lg sm:text-xl font-festive tracking-wider uppercase shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-neutral-950" />
            <span>RESUME</span>
          </button>

          {/* Restart */}
          <button
            id="pause-restart-btn"
            onClick={onRestart}
            className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-200 font-semibold text-base sm:text-lg border border-amber-500/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span>RESTART RUN</span>
          </button>

          {/* Quick Guide */}
          <button
            onClick={onOpenTutorial}
            className="w-full py-2.5 sm:py-3 px-6 rounded-2xl bg-neutral-800/60 hover:bg-neutral-700 text-amber-200/90 text-sm sm:text-base border border-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span>How to Play</span>
          </button>

          {/* Settings & Home in a row */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-1">
            <button
              onClick={onOpenSettings}
              className="py-2.5 sm:py-3 px-4 rounded-2xl bg-neutral-800/60 hover:bg-neutral-700 text-amber-200/90 text-sm sm:text-base border border-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span>Settings</span>
            </button>
            <button
              id="pause-home-btn"
              onClick={onHome}
              className="py-2.5 sm:py-3 px-4 rounded-2xl bg-neutral-800/60 hover:bg-neutral-700 text-amber-200/90 text-sm sm:text-base border border-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
