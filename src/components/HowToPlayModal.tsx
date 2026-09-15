import React from 'react';
import { X, Play, Shield, Sparkles, Flame } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
  onPlayDirectly?: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose, onPlayDirectly }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-neutral-900/95 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/80 flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl sm:text-2xl font-black font-festive text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-400">
              HOW TO PLAY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer active:scale-95"
            aria-label="Close Tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 text-left">
          {/* Section 1: JUMP CONTROLS */}
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>॥ 1. JUMP CONTROLS (TAP / SPACE) ॥</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Single Jump */}
              <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-2.5 flex flex-col items-center">
                <div className="text-2xl mb-1">👆</div>
                <div className="text-xs font-bold text-amber-200">1x TAP</div>
                <div className="text-[10px] text-neutral-400">Normal Jump</div>
              </div>
              {/* Double Jump */}
              <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-2.5 flex flex-col items-center">
                <div className="text-2xl mb-1">👆👆</div>
                <div className="text-xs font-bold text-amber-200">2x TAP</div>
                <div className="text-[10px] text-neutral-400">Mid-air Boost</div>
              </div>
              {/* Triple Jump */}
              <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-2.5 flex flex-col items-center">
                <div className="text-2xl mb-1">👆👆👆</div>
                <div className="text-xs font-bold text-amber-200">3x TAP</div>
                <div className="text-[10px] text-neutral-400">Sky Leap Aura</div>
              </div>
            </div>
          </div>

          {/* Section 2: SACRED COLLECTIBLES */}
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              ॥ 2. SACRED COLLECTIBLES ॥
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Modak */}
              <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-lg shrink-0">
                  🥟
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300">Modak</div>
                  <div className="text-[10px] text-neutral-300">+10 Score Points</div>
                </div>
              </div>

              {/* Durva */}
              <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-lg shrink-0">
                  🌿
                </div>
                <div>
                  <div className="text-xs font-bold text-green-300">Durva</div>
                  <div className="text-[10px] text-neutral-300">+Combo Multiplier</div>
                </div>
              </div>

              {/* Flower */}
              <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-lg shrink-0">
                  🌸
                </div>
                <div>
                  <div className="text-xs font-bold text-pink-300">Flower</div>
                  <div className="text-[10px] text-neutral-300">+15% Utsav Meter</div>
                </div>
              </div>

              {/* Diya */}
              <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-lg shrink-0">
                  🪔
                </div>
                <div>
                  <div className="text-xs font-bold text-yellow-300">Diya</div>
                  <div className="text-[10px] text-neutral-300">Sacred Shield!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: DODGE OBSTACLES */}
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              ॥ 3. FESTIVAL OBSTACLES ॥
            </div>
            <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-3 flex justify-around text-center">
              <div>
                <span className="text-xl">📦</span>
                <div className="text-[10px] text-neutral-300 mt-1">Crates</div>
              </div>
              <div>
                <span className="text-xl">🪨</span>
                <div className="text-[10px] text-neutral-300 mt-1">Stones</div>
              </div>
              <div>
                <span className="text-xl">🛒</span>
                <div className="text-[10px] text-neutral-300 mt-1">Carts</div>
              </div>
              <div>
                <span className="text-xl">🏺</span>
                <div className="text-[10px] text-neutral-300 mt-1">Clay Pots</div>
              </div>
              <div>
                <span className="text-xl">🌊</span>
                <div className="text-[10px] text-neutral-300 mt-1">River Gaps</div>
              </div>
            </div>
          </div>

          {/* Section 4: MAHOTSAV MODE */}
          <div className="bg-gradient-to-r from-amber-950/70 via-red-950/70 to-amber-950/70 border border-amber-400/50 rounded-2xl p-3 flex items-center gap-3">
            <Flame className="w-7 h-7 text-yellow-400 fill-yellow-400 shrink-0 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-yellow-300 font-festive">MAHOTSAV MODE (WOW MOMENT)</div>
              <div className="text-[10px] text-amber-100/90 leading-relaxed">
                Fill the Utsav Meter to 100% to unleash festive celebration! Fast dhol rhythm, golden magnetic modaks, invincibility and 2x score for 12 seconds!
              </div>
            </div>
          </div>
        </div>

        {/* Play / Close CTA */}
        <div className="pt-3 border-t border-amber-500/30 mt-2">
          {onPlayDirectly ? (
            <button
              onClick={() => {
                onClose();
                onPlayDirectly();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-base font-festive tracking-wider uppercase shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <Play className="w-5 h-5 fill-neutral-950" />
              <span>START PLAYING NOW</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-sm uppercase tracking-wider border border-amber-500/40 cursor-pointer active:scale-95 transition-transform"
            >
              GOT IT!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
