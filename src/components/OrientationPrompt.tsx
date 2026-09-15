import React, { useEffect } from 'react';
import { Sparkles, ArrowRight, Smartphone } from 'lucide-react';

interface OrientationPromptProps {
  onDismiss: () => void;
  onContinueInPortrait: () => void;
  isLandscape: boolean;
}

export const OrientationPrompt: React.FC<OrientationPromptProps> = ({
  onDismiss,
  onContinueInPortrait,
  isLandscape,
}) => {
  // Automatically dismiss if the user rotates the device to landscape
  useEffect(() => {
    if (isLandscape) {
      onDismiss();
    }
  }, [isLandscape, onDismiss]);

  return (
    <div
      id="orientation-prompt-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md select-none text-white animate-fade-in"
    >
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#180e29] via-[#241038] to-[#0d0517] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.35)] flex flex-col items-center text-center overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-amber-500/20 to-transparent pointer-events-none" />

        {/* Lotus & Sparkle Badges */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-400 text-sm">🪷</span>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300/90 font-festive">
            Recommended For Gameplay
          </span>
          <span className="text-amber-400 text-sm">🪷</span>
        </div>

        {/* Animated Phone Rotation Graphic */}
        <div className="relative my-4 flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
          {/* Rotating Ring Halo */}
          <div className="absolute inset-0 rounded-full border border-amber-400/30 border-dashed animate-spin-slow" />
          
          {/* Subtle Pulses */}
          <div className="absolute inset-2 rounded-full bg-amber-500/10 animate-pulse" />

          {/* Animated Tilting Phone Container */}
          <div className="relative flex items-center justify-center animate-phone-rotate">
            <div className="w-14 h-24 sm:w-16 sm:h-28 border-2 border-amber-400 rounded-2xl bg-neutral-900/90 flex flex-col items-center justify-between p-1.5 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
              {/* Speaker notch */}
              <div className="w-4 h-1 rounded-full bg-amber-400/60" />

              {/* Screen icon: Mushak running */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl filter drop-shadow">🐭</span>
                <span className="text-[9px] font-bold text-amber-300 font-festive">MUSHAK</span>
              </div>

              {/* Home indicator bar */}
              <div className="w-5 h-1 rounded-full bg-amber-400/60" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-black font-festive text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-amber-400 mb-2">
          TURN YOUR PHONE SIDEWAYS
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed max-w-xs mb-5 font-medium">
          Rotate to <strong className="text-amber-300 font-bold">Landscape Mode</strong> for a wider view of the sacred festival road, earlier obstacle visibility, and smoother jumps!
        </p>

        {/* Features Checklist */}
        <div className="w-full bg-neutral-950/60 border border-amber-500/30 rounded-2xl p-3 mb-5 flex flex-col gap-2 text-left text-xs text-amber-200/90 font-medium">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Widescreen field of view with spacious road ahead</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Tap anywhere on screen to Jump</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Full-screen festival ambiance with zero clutter</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Subtle rotate indicator */}
          <div className="text-xs text-amber-400/90 font-bold flex items-center justify-center gap-1.5 py-1">
            <Smartphone className="w-4 h-4 animate-bounce" />
            <span>Turn your device now to auto-switch</span>
          </div>

          {/* Continue in Portrait option */}
          <button
            id="continue-portrait-btn"
            onClick={onContinueInPortrait}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-98 transition-all border border-amber-500/30 text-amber-200/80 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue in Portrait anyway</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
