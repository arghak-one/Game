import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, Sparkles, Trash2, AlertTriangle } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-neutral-900/95 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/80 flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
          <h3 className="text-xl sm:text-2xl font-black font-festive text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-400">
            SETTINGS
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer active:scale-95"
            aria-label="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 mb-5">
          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/60 border border-amber-500/20">
            <div className="flex items-center gap-3 text-amber-200">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-neutral-500" />}
              <span className="font-semibold text-sm">Sound Effects</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Festival Music / Dhol */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/60 border border-amber-500/20">
            <div className="flex items-center gap-3 text-amber-200">
              <Music className={`w-5 h-5 ${settings.musicEnabled ? 'text-amber-400' : 'text-neutral-500'}`} />
              <div>
                <div className="font-semibold text-sm">Festival Dhol Beats</div>
                <div className="text-[10px] text-amber-200/60">Procedural rhythmic percussion</div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ musicEnabled: !settings.musicEnabled })}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                settings.musicEnabled ? 'bg-amber-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Effects */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/60 border border-amber-500/20">
            <div className="flex items-center gap-3 text-amber-200">
              <Sparkles className={`w-5 h-5 ${!settings.reducedEffects ? 'text-amber-400' : 'text-neutral-500'}`} />
              <div>
                <div className="font-semibold text-sm">Reduced Effects</div>
                <div className="text-[10px] text-amber-200/60">Optimizes for older mobile devices</div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ reducedEffects: !settings.reducedEffects })}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                settings.reducedEffects ? 'bg-amber-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  settings.reducedEffects ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset Section */}
        <div className="border-t border-amber-500/20 pt-4 mb-4">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Best Score & Progress</span>
            </button>
          ) : (
            <div className="bg-red-950/80 border border-red-500/60 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-red-200 font-bold text-xs mb-1">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Confirm Reset?</span>
              </div>
              <p className="text-[10px] text-red-200/70 mb-3">
                This will erase your high score and saved ranks.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold text-white cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-bold text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-sm uppercase tracking-wider border border-amber-500/40 cursor-pointer active:scale-95 transition-transform"
        >
          SAVE & CLOSE
        </button>
      </div>
    </div>
  );
};
