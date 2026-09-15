import React, { useEffect, useState } from 'react';
import { Trophy, Home, MapPin, Sparkles } from 'lucide-react';
import { GameStats } from '../types';
import { SoundManager } from '../audio/SoundManager';
import { FESTIVAL_BG_IMAGE, MUSHAK_RESTING_IMAGE } from '../assets/characterAssets';
import { StatCard } from './game-over/StatCard';
import { ScoreReveal } from './game-over/ScoreReveal';
import { PlayerRankSection } from './game-over/PlayerRankSection';
import { GameOverActions } from './game-over/GameOverActions';
import { CelebrationEffects } from './game-over/CelebrationEffects';

interface GameOverModalProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onHome: () => void;
  onOpenLeaderboard: () => void;
  onSaveScore: (name: string) => void;
  playerName: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onPlayAgain,
  onHome,
  onOpenLeaderboard,
  onSaveScore,
  playerName,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const isNewBest = stats.isNewBest ?? (stats.score >= stats.bestScore && stats.score > 0);

  // Trigger gentle game over chime once when screen mounts
  useEffect(() => {
    const sound = SoundManager.getInstance();
    sound.playGameOverChime();
  }, []);

  const handleSave = (name: string) => {
    onSaveScore(name);
    setIsSaved(true);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md select-none overflow-y-auto">
      {/* Cinematic Festival Atmosphere Canvas Container */}
      <div
        style={{ maxWidth: 'var(--gameover-max-w, 680px)' }}
        className="relative w-full min-h-0 sm:min-h-[520px] max-h-[96dvh] overflow-y-auto rounded-3xl border-2 border-amber-500/50 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between my-auto bg-gradient-to-b from-[#07152f] via-[#17113f] to-[#0a0612]"
      >
        
        {/* Deep Festive Background with Lord Ganesha Pandal Depth */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={FESTIVAL_BG_IMAGE}
            alt="Festival Street"
            className="w-full h-full object-cover object-center opacity-35 filter blur-[1.5px] scale-105 transform"
          />
          {/* Rich Midnight Blue / Festival Maroon Lighting Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-[#17113f]/85 to-[#07040d]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.2),transparent_70%)]" />
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        {/* Floating Embers & Flower Petals */}
        <CelebrationEffects />

        {/* Top Floating Festive Accents Bar */}
        <div className="relative z-10 w-full pt-3 px-3.5 sm:px-6 flex items-center justify-between">
          {/* Top Left: Blessed Run Pill */}
          <div className="flex items-center gap-1.5 bg-neutral-950/80 border border-amber-500/40 rounded-full py-0.5 px-2.5 sm:py-1 sm:px-3.5 shadow-md backdrop-blur-sm">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-amber-400 bg-amber-900/40 flex items-center justify-center">
              <span className="text-xs sm:text-sm">🐭</span>
            </div>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-amber-200 font-festive tracking-wide">
              Blessed Run
            </span>
            <span className="text-[11px] sm:text-xs">🌸</span>
          </div>

          {/* Top Right: Ganpati Bappa Morya script */}
          <div className="flex items-center gap-1 text-right">
            <span className="text-xs sm:text-sm md:text-base font-bold text-amber-300 font-festive drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Ganpati Bappa
            </span>
            <span className="text-xs sm:text-sm text-yellow-300">💛</span>
            <span className="text-xs sm:text-sm md:text-base font-black text-amber-200 font-festive drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Morya!
            </span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse ml-0.5" />
          </div>
        </div>

        {/* Central Upper Section: 3D Game Over Title & Ribbon */}
        <div className="relative z-10 w-full flex flex-col items-center text-center px-3 pt-1">
          {/* Ornate Gold Crown Crest */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-amber-400/80 text-xs sm:text-sm">🪷</span>
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="text-base sm:text-xl text-amber-300 filter drop-shadow">👑</span>
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="text-amber-400/80 text-xs sm:text-sm">🪷</span>
          </div>

          {/* 3D Gold Sculpted GAME OVER Title */}
          <div className="relative flex items-center justify-center">
            {/* Flanking Floral Garlands */}
            <span className="absolute -left-6 sm:-left-9 md:-left-12 text-lg sm:text-2xl md:text-3xl filter drop-shadow animate-float-subtle">
              🌺
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-festive tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-amber-500 game-over-title-3d uppercase">
              GAME OVER
            </h1>

            <span
              className="absolute -right-6 sm:-right-9 md:-right-12 text-lg sm:text-2xl md:text-3xl filter drop-shadow animate-float-subtle"
              style={{ animationDelay: '1.5s' }}
            >
              🌺
            </span>
          </div>

          {/* Curved Crimson Festival Ribbon */}
          <div className="mt-1 relative max-w-[320px] sm:max-w-[400px] md:max-w-[460px] px-3 sm:px-5 py-1 rounded-full bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border border-amber-400/60 shadow-lg shadow-black/70 flex items-center justify-center gap-1.5">
            <span className="text-amber-400 text-[10px] sm:text-xs">✤</span>
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-amber-100 font-festive tracking-wide">
              A joyful festival journey filled with devotion!
            </p>
            <span className="text-amber-400 text-[10px] sm:text-xs">✤</span>
          </div>
        </div>

        {/* Middle Section: Resting Mushak Hero & Festival Signs */}
        <div className="relative z-10 w-full px-3 py-1 flex items-center justify-center">
          {/* Left Wooden Signpost */}
          <div className="hidden min-[380px]:flex absolute left-2 sm:left-4 md:left-6 bottom-2 flex-col items-center bg-amber-950/80 border border-amber-700/60 rounded-lg p-1.5 sm:p-2 shadow-lg max-w-[76px] sm:max-w-[96px] md:max-w-[110px] text-center backdrop-blur-sm transform -rotate-2">
            <span className="text-[8px] sm:text-[10px] font-bold text-amber-200 font-festive leading-tight">
              Small Steps Big Blessings
            </span>
            <span className="text-[9px] sm:text-xs text-rose-400 mt-0.5">❤️</span>
          </div>

          {/* Resting Mushak Hero Display on Stone Street */}
          <div className="relative w-44 sm:w-56 md:w-68 lg:w-76 h-24 sm:h-28 md:h-34 flex items-center justify-center">
            {/* Ambient Golden Floor Diya Halo */}
            <div className="absolute inset-x-2 bottom-0 h-10 bg-amber-500/20 rounded-full blur-lg pointer-events-none" />

            <img
              src={MUSHAK_RESTING_IMAGE}
              alt="Cute Resting Mushak"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] z-10"
            />

            {/* Glowing Diya Lights on Street */}
            <div className="absolute -left-2 sm:-left-4 bottom-1 flex items-center gap-0.5 z-10">
              <span className="text-base sm:text-xl animate-diya filter drop-shadow-[0_0_8px_#f59e0b]">
                🪔
              </span>
            </div>
            <div className="absolute -right-2 sm:-right-4 bottom-1 flex items-center gap-0.5 z-10">
              <span className="text-base sm:text-xl animate-diya filter drop-shadow-[0_0_8px_#f59e0b]">
                🪔
              </span>
            </div>

            {/* Scattered flower petals on stone path */}
            <div className="absolute bottom-0 left-8 text-[11px] sm:text-sm opacity-80 z-10">🌸</div>
            <div className="absolute bottom-1 right-10 text-[10px] sm:text-xs opacity-80 z-10">🌼</div>
          </div>

          {/* Right Hanging Festival Banner */}
          <div className="hidden min-[380px]:flex absolute right-2 sm:right-4 md:right-6 bottom-2 flex-col items-center bg-gradient-to-b from-rose-950/85 to-amber-950/85 border border-amber-500/40 rounded-lg p-1.5 sm:p-2 shadow-lg max-w-[80px] sm:max-w-[100px] md:max-w-[115px] text-center backdrop-blur-sm transform rotate-1">
            <span className="text-[8px] sm:text-[10px] font-black text-amber-200 font-festive leading-tight uppercase">
              Faith Runs Further Than Distance
            </span>
          </div>
        </div>

        {/* Lower Section: Ornate Gold Score Card & Actions */}
        <div className="relative z-10 w-full px-2.5 sm:px-4 md:px-6 pb-2.5 sm:pb-4">
          <div className="w-full ornate-gold-panel border-2 border-amber-500/70 rounded-2xl p-2.5 sm:p-4 md:p-5 flex flex-col gap-2 sm:gap-3 shadow-2xl relative">
            {/* Top Ornamental Gold Corner Flourishes */}
            <div className="absolute -top-1.5 left-4 text-xs sm:text-sm text-amber-300 drop-shadow">⚜️</div>
            <div className="absolute -top-1.5 right-4 text-xs sm:text-sm text-amber-300 drop-shadow">⚜️</div>

            {/* 1. Animated Score Reveal Header & Big Number */}
            <ScoreReveal score={stats.score} isNewBest={isNewBest} />

            {/* 2. Compact Stats Row */}
            <div className="w-full flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
              <StatCard
                icon={<Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
                label="BEST"
                value={stats.bestScore}
                highlightColor="text-amber-300"
              />
              <StatCard
                icon={<span className="text-xs sm:text-base">🥟</span>}
                label="MODAKS"
                value={stats.modaks}
                highlightColor="text-yellow-400"
              />
              <StatCard
                icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
                label="DISTANCE"
                value={stats.distance}
                unit="m"
                highlightColor="text-amber-200"
              />
            </div>

            {/* 3. Player Name & Save Rank Section */}
            <PlayerRankSection
              playerName={playerName}
              onSaveScore={handleSave}
              isSaved={isSaved}
            />

            {/* 4. Action Buttons (Play Again + Ranks + Home) */}
            <GameOverActions
              onPlayAgain={onPlayAgain}
              onOpenLeaderboard={onOpenLeaderboard}
              onHome={onHome}
            />
          </div>

          {/* Sacred Bottom Motif */}
          <div className="flex flex-col items-center justify-center mt-1.5 sm:mt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-amber-400/60">⊱</span>
              <span className="text-[9px] sm:text-xs font-bold text-amber-300/80 font-festive tracking-widest uppercase">
                More Than A Game • A Celebration
              </span>
              <span className="text-[10px] sm:text-xs text-amber-400/60">⊰</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
