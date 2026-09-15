import React from 'react';
import { X, Check, Lock } from 'lucide-react';
import { CharacterSkin } from '../types';
import { SKINS } from '../game/constants';
import { SKIN_IMAGES } from '../assets/characterAssets';

interface CharactersModalProps {
  onClose: () => void;
  selectedSkin: CharacterSkin;
  onSelectSkin: (skin: CharacterSkin) => void;
  totalModaks: number;
}

export const CharactersModal: React.FC<CharactersModalProps> = ({
  onClose,
  selectedSkin,
  onSelectSkin,
  totalModaks,
}) => {
  const skinKeys: CharacterSkin[] = ['classic', 'royal', 'golden', 'cosmic'];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-neutral-900/95 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/80 flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-festive text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-400">
              MUSHAK ATTIRE
            </h3>
            <p className="text-[10px] text-amber-200/60">Unlock sacred festive outfits with Modaks</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer active:scale-95"
            aria-label="Close Skins"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Lifetime Modaks Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-2 flex items-center justify-between mb-4">
          <span className="text-xs text-amber-200/80 font-medium">Total Modaks Collected:</span>
          <div className="flex items-center gap-1.5 font-yatra text-base font-bold text-yellow-300">
            <span>🥟</span>
            <span>{totalModaks}</span>
          </div>
        </div>

        {/* Skins Grid */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
          {skinKeys.map((key) => {
            const skin = SKINS[key];
            const isUnlocked = totalModaks >= skin.requiredModaks || skin.unlocked;
            const isSelected = selectedSkin === key;

            return (
              <div
                key={key}
                onClick={() => {
                  if (isUnlocked) onSelectSkin(key);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : isUnlocked
                    ? 'bg-neutral-950/60 border-neutral-800 hover:border-amber-500/40 cursor-pointer active:scale-[0.98]'
                    : 'bg-neutral-950/30 border-neutral-800/60 opacity-60'
                }`}
              >
                {/* Visual Avatar preview */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-md relative bg-neutral-950 shrink-0">
                    <img
                      src={SKIN_IMAGES[key] || SKIN_IMAGES.classic}
                      alt={skin.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base text-amber-100 flex items-center gap-2">
                      <span>{skin.name}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-amber-500 text-neutral-950 font-black px-2 py-0.5 rounded-full uppercase">
                          Equipped
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-200/70">{skin.subtitle}</div>
                  </div>
                </div>

                {/* Status or Unlock Req */}
                <div>
                  {isSelected ? (
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : isUnlocked ? (
                    <button className="text-xs bg-neutral-800 hover:bg-neutral-700 text-amber-200 font-bold px-3 py-1.5 rounded-xl border border-amber-500/30">
                      Equip
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{skin.requiredModaks} 🥟</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-sm uppercase tracking-wider border border-amber-500/40 cursor-pointer active:scale-95 transition-transform"
        >
          CONFIRM & BACK
        </button>
      </div>
    </div>
  );
};
