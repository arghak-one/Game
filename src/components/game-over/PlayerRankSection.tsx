import React, { useState } from 'react';
import { User, Crown, Check, Edit3 } from 'lucide-react';
import { SoundManager } from '../../audio/SoundManager';

interface PlayerRankSectionProps {
  playerName: string;
  onSaveScore: (name: string) => void;
  isSaved?: boolean;
}

export const PlayerRankSection: React.FC<PlayerRankSectionProps> = ({
  playerName,
  onSaveScore,
  isSaved = false,
}) => {
  const [nameInput, setNameInput] = useState(playerName || 'Devotee');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sound = SoundManager.getInstance();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim() || 'Devotee';
    setNameInput(cleanName);
    onSaveScore(cleanName);
    setSaved(true);
    setIsEditing(false);
    sound.playSaveSuccess();
    setFeedback('Rank Saved!');
    setTimeout(() => {
      setFeedback(null);
    }, 2500);
  };

  return (
    <form onSubmit={handleSave} className="w-full flex items-center gap-2 relative">
      {/* Player Name Card */}
      <div
        onClick={() => {
          if (!saved) setIsEditing(true);
        }}
        className="flex-1 flex items-center gap-2 bg-neutral-950/85 border border-amber-500/40 rounded-xl px-3 py-2 text-xs sm:text-sm text-amber-100 shadow-inner backdrop-blur-sm cursor-pointer transition-colors hover:border-amber-400"
      >
        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />

        {isEditing ? (
          <input
            type="text"
            maxLength={16}
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => setIsEditing(false)}
            placeholder="Your name"
            className="w-full bg-transparent text-amber-100 text-xs sm:text-sm font-semibold focus:outline-none placeholder-amber-400/40"
          />
        ) : (
          <span className="w-full text-left font-semibold text-amber-100 truncate text-xs sm:text-sm">
            {nameInput}
          </span>
        )}

        {!isEditing && !saved && (
          <Edit3 className="w-3 h-3 text-amber-400/70 hover:text-amber-300 shrink-0" />
        )}
      </div>

      {/* Save Rank Button */}
      <button
        type="submit"
        disabled={saved}
        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold font-festive text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
          saved
            ? 'bg-emerald-800/80 border border-emerald-400 text-emerald-100 cursor-default'
            : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 border border-yellow-200 text-neutral-950 hover:shadow-[0_0_12px_rgba(245,158,11,0.5)]'
        }`}
      >
        {saved ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-200" />
            <span>Saved</span>
          </>
        ) : (
          <>
            <Crown className="w-3.5 h-3.5 fill-neutral-950" />
            <span>Save Rank</span>
          </>
        )}
      </button>

      {/* Floating Mini Toast Feedback */}
      {feedback && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 text-[10px] font-black font-festive px-2.5 py-0.5 rounded-full shadow-lg border border-yellow-100 animate-bounce pointer-events-none whitespace-nowrap">
          {feedback}
        </div>
      )}
    </form>
  );
};
