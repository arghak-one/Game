import React from 'react';
import { X, Trophy, Medal, Flame } from 'lucide-react';
import { ScoreRecord } from '../types';

interface LeaderboardModalProps {
  onClose: () => void;
  records: ScoreRecord[];
  currentScore?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose, records }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-neutral-900/95 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/80 flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-festive text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-400">
                FESTIVAL RANKS
              </h3>
              <p className="text-[10px] text-amber-200/60">Local Festival Hall of Fame</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer active:scale-95"
            aria-label="Close Leaderboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-200/90 flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Scores are saved to your device and ready for cloud festival sync!</span>
        </div>

        {/* List of High Scores */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 max-h-[380px]">
          {records.map((rec, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const medalColor =
              rank === 1
                ? 'text-yellow-400 bg-yellow-400/20 border-yellow-400/60'
                : rank === 2
                ? 'text-neutral-300 bg-neutral-300/20 border-neutral-300/60'
                : rank === 3
                ? 'text-amber-600 bg-amber-600/20 border-amber-600/60'
                : 'text-neutral-400 bg-neutral-800/40 border-neutral-700';

            return (
              <div
                key={rec.id || index}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isTop3
                    ? 'bg-gradient-to-r from-neutral-900/90 to-amber-950/40 border-amber-500/40'
                    : 'bg-neutral-950/60 border-neutral-800'
                }`}
              >
                {/* Rank & Name */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs ${medalColor}`}
                  >
                    {isTop3 ? <Medal className="w-3.5 h-3.5" /> : rank}
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base text-amber-100 flex items-center gap-1.5">
                      <span>{rec.name}</span>
                      {rank === 1 && <span className="text-xs">👑</span>}
                    </div>
                    <div className="text-[10px] text-amber-200/60 flex items-center gap-2">
                      <span>{rec.distance.toLocaleString()} m</span>
                      <span>•</span>
                      <span>{rec.modaks} Modaks</span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="font-black text-base sm:text-lg text-amber-400 font-yatra">
                    {rec.score.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-neutral-500">{rec.date}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-sm uppercase tracking-wider border border-amber-500/40 cursor-pointer active:scale-95 transition-transform"
        >
          BACK TO GAME
        </button>
      </div>
    </div>
  );
};
