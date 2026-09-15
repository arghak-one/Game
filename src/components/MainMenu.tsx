import React, { useState } from 'react';
import { BookOpen, Settings, Trophy, Sparkles, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { CharacterSkin } from '../types';
import { SKINS } from '../game/constants';
import { FESTIVAL_BG_IMAGE, SKIN_IMAGES } from '../assets/characterAssets';
import { SoundManager } from '../audio/SoundManager';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenTutorial: () => void;
  onOpenLeaderboard: () => void;
  onOpenCharacters: () => void;
  onOpenSettings: () => void;
  bestScore: number;
  selectedSkin: CharacterSkin;
  onSelectSkin?: (skin: CharacterSkin) => void;
  totalModaks?: number;
}

const SKIN_ORDER: CharacterSkin[] = ['classic', 'royal', 'golden', 'cosmic'];

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenTutorial,
  onOpenLeaderboard,
  onOpenCharacters,
  onOpenSettings,
  bestScore,
  selectedSkin,
  onSelectSkin,
  totalModaks = 0,
}) => {
  const currentSkin = SKINS[selectedSkin] || SKINS.classic;
  const currentIndex = SKIN_ORDER.indexOf(selectedSkin);
  const [isPressingPlay, setIsPressingPlay] = useState(false);

  const sound = SoundManager.getInstance();

  const handlePrevSkin = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playButtonClick();
    const prevIdx = (currentIndex - 1 + SKIN_ORDER.length) % SKIN_ORDER.length;
    onSelectSkin?.(SKIN_ORDER[prevIdx]);
  };

  const handleNextSkin = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playButtonClick();
    const nextIdx = (currentIndex + 1) % SKIN_ORDER.length;
    onSelectSkin?.(SKIN_ORDER[nextIdx]);
  };

  const handlePlay = () => {
    setIsPressingPlay(true);
    sound.playButtonClick();
    sound.playMahotsavStart();
    setTimeout(() => {
      onStartGame();
    }, 180);
  };

  return (
    <div
      id="main-menu-root"
      className="absolute inset-0 z-20 flex flex-col justify-between items-center select-none overflow-hidden text-white"
    >
      {/* ========================================================================= */}
      {/* LAYER 1: CINEMATIC FESTIVAL BACKGROUND WITH PARALLAX DEPTH & VIGNETTE     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Cinematic 9:16 Render: Moonlit Pandal, Fairy Light Arches & Street */}
        <img
          src={FESTIVAL_BG_IMAGE}
          alt="Festive Ganesh Chaturthi Night Street"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.92] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Color Gradients for UI Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/85 via-purple-950/25 to-neutral-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15)_0%,rgba(0,0,0,0.55)_80%)]" />

        {/* Floating Glowing Firefly Sparks / Embers */}
        <div className="absolute bottom-24 left-[15%] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b] animate-ember-1" />
        <div className="absolute bottom-32 left-[82%] w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047] animate-ember-2" />
        <div className="absolute bottom-44 left-[28%] w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#ea580c] animate-ember-3" />
        <div className="absolute bottom-20 left-[70%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ember-4" />

        {/* Floating Festive Petals */}
        <div className="absolute top-[28%] left-[10%] text-sm opacity-60 animate-float-subtle">🌸</div>
        <div className="absolute top-[38%] right-[8%] text-xs opacity-50 animate-float-subtle" style={{ animationDelay: '1.5s' }}>🌼</div>

        {/* Left Side: Carved Wooden Festival Signpost ("Small Steps Big Blessings") */}
        <div className="hidden sm:flex absolute left-3 md:left-6 lg:left-8 bottom-24 md:bottom-28 lg:bottom-32 flex-col items-center pointer-events-none z-10 opacity-90 transition-opacity">
          <div className="bg-gradient-to-b from-amber-900/90 to-amber-950/95 border-2 border-amber-600/70 rounded-xl p-2.5 md:p-3 shadow-2xl shadow-black/80 text-center w-28 md:w-32 lg:w-36 backdrop-blur-sm">
            <div className="flex justify-center mb-1">
              <span className="text-amber-400 text-base md:text-lg drop-shadow">🐾</span>
            </div>
            <span className="block text-[10px] md:text-xs font-black tracking-wider text-amber-200 font-festive uppercase leading-tight">
              Small Steps
            </span>
            <span className="block text-[9px] md:text-[11px] font-bold tracking-wide text-amber-400 font-yatra">
              Big Blessings
            </span>
          </div>
          {/* Wooden post leg */}
          <div className="w-2 md:w-2.5 h-8 md:h-10 bg-gradient-to-b from-amber-950 to-neutral-900 border-x border-amber-800/60" />
          {/* Small Modak Thali with Diya at Base */}
          <div className="bg-amber-950/90 border border-amber-500/60 rounded-full px-2.5 py-1 md:px-3 md:py-1.5 flex items-center gap-1 shadow-lg -mt-1">
            <span className="text-xs md:text-sm">🪔</span>
            <span className="text-[10px] md:text-xs text-amber-300 font-yatra">🥟 🥟</span>
          </div>
        </div>

        {/* Right Side: Festival Saffron Flag Banner ("FAITH MOVES THE WORLD") */}
        <div className="hidden sm:flex absolute right-3 md:right-6 lg:right-8 bottom-24 md:bottom-28 lg:bottom-32 flex-col items-center pointer-events-none z-10 opacity-90 transition-opacity">
          <div className="relative bg-gradient-to-b from-orange-600/90 via-amber-600/90 to-red-700/90 border-2 border-amber-300/80 rounded-t-xl rounded-b-2xl p-2.5 md:p-3 shadow-2xl shadow-black/80 text-center w-28 md:w-32 lg:w-36 backdrop-blur-sm">
            <div className="text-[9px] md:text-[10px] text-amber-100/90 font-yatra mb-0.5">॥ शुभ लाभ ॥</div>
            <div className="text-[9px] md:text-[10px] font-black text-white font-festive tracking-wider uppercase leading-tight drop-shadow">
              Faith Moves
            </div>
            <div className="text-[9px] md:text-[10px] font-bold text-amber-200 font-festive tracking-wide uppercase leading-tight drop-shadow">
              The World
            </div>
            {/* Hanging golden tassel */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-amber-300">
              ⚜️
            </div>
          </div>
          <div className="w-1.5 md:w-2 h-7 md:h-9 bg-amber-400/80 mt-2 rounded-full shadow" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2: TOP FLOATING STATUS BAR                                          */}
      {/* ========================================================================= */}
      <div
        className="relative z-10 w-full px-3 sm:px-6 pt-2 sm:pt-3 pb-1 flex justify-between items-center"
        style={{ maxWidth: 'min(94%, calc(var(--nav-max-w) * 1.35))' }}
      >
        {/* Left Badge: BEST SCORE with Laurel Trophy */}
        <div
          id="badge-best-score"
          className="flex items-center gap-1.5 sm:gap-2.5 bg-gradient-to-r from-red-950/90 via-neutral-900/90 to-red-950/90 border border-amber-500/60 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 shadow-[0_0_15px_rgba(245,158,11,0.25)] backdrop-blur-md"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] sm:text-xs md:text-sm tracking-wider text-amber-200/80 font-bold font-festive">
              BEST:
            </span>
            <span className="text-xs sm:text-sm md:text-base font-bold text-amber-300 font-yatra tracking-wide">
              {bestScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right Badge: Ganpati Bappa Morya! with Diya */}
        <div
          id="badge-bappa-morya"
          className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-950/90 via-neutral-900/90 to-amber-950/90 border border-amber-500/60 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 shadow-[0_0_15px_rgba(245,158,11,0.25)] backdrop-blur-md"
        >
          <span className="text-xs sm:text-sm md:text-base animate-pulse">🪔</span>
          <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-amber-200 font-yatra tracking-wider">
            Ganpati Bappa Morya!
          </span>
          <span className="text-xs sm:text-sm md:text-base animate-pulse">🪔</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: TITLE AREA & SACRED BRANDING                                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-0.5 sm:pt-1 pb-1">
        {/* Sacred Invocation */}
        <div className="flex items-center gap-2 mb-0.5 sm:mb-1 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
          <span className="text-amber-400 text-xs sm:text-sm md:text-base">✦</span>
          <span className="text-amber-200 text-xs sm:text-sm md:text-base font-bold font-yatra tracking-widest">
            ॥ श्री गणेशाय नमः ॥
          </span>
          <span className="text-amber-400 text-xs sm:text-sm md:text-base">✦</span>
        </div>

        {/* Golden Lotus Crest with Sun Rays */}
        <div className="relative flex items-center justify-center -mb-1">
          <div className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse">
            🪷
          </div>
        </div>

        {/* 3D Sculpted Game Title: MUSHAK MAHOTSAV */}
        <div className="relative flex flex-col items-center">
          {/* Flanking Floral Blossoms (Marigold & Hibiscus) */}
          <div className="absolute -left-6 sm:-left-9 md:-left-12 top-1 text-lg sm:text-2xl md:text-3xl filter drop-shadow-md select-none">
            🌺
          </div>
          <div className="absolute -right-6 sm:-right-9 md:-right-12 top-1 text-lg sm:text-2xl md:text-3xl filter drop-shadow-md select-none">
            🌺
          </div>

          <h1
            className="font-black font-festive tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-amber-500 gold-title-3d leading-none"
            style={{ fontSize: 'var(--title-mushak)' }}
          >
            MUSHAK
          </h1>
          <h2
            className="font-black font-festive tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-orange-400 to-rose-600 crimson-title-3d leading-none -mt-1 sm:-mt-2 md:-mt-3"
            style={{ fontSize: 'var(--title-mahotsav)' }}
          >
            MAHOTSAV
          </h2>
        </div>

        {/* Curved Festival Crimson/Maroon Banner */}
        <div className="mt-1.5 sm:mt-2.5 relative flex items-center justify-center">
          <div className="relative bg-gradient-to-r from-red-950 via-red-800 to-red-950 border-y-2 border-x border-amber-400 px-5 sm:px-8 md:px-10 py-0.5 sm:py-1 rounded-full shadow-[0_4px_16px_rgba(185,28,28,0.6)]">
            <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-widest text-yellow-200 font-festive uppercase drop-shadow">
              The Great Ganpati Rush
            </span>
          </div>
        </div>

        {/* Subtitle Tagline */}
        <div className="flex items-center gap-2 mt-1 sm:mt-1.5 text-amber-200/90 text-[11px] sm:text-xs md:text-sm font-medium tracking-widest">
          <span className="text-amber-400 text-[10px] md:text-xs">⚜️</span>
          <span>Run • Collect • Celebrate</span>
          <span className="text-amber-400 text-[10px] md:text-xs">⚜️</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 4: CENTRAL CHARACTER SHOWCASE (MEDALLION & SKIN CAROUSEL)            */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1 min-h-0 flex-shrink">
        <div className="relative flex items-center justify-center">
          {/* Left Arrow: Previous Skin */}
          <button
            id="btn-prev-skin"
            onClick={handlePrevSkin}
            className="absolute -left-11 sm:-left-16 md:-left-20 lg:-left-24 z-20 w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-neutral-900/80 hover:bg-neutral-800 active:scale-90 border-2 border-amber-400/80 text-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] backdrop-blur-md cursor-pointer transition-transform"
            aria-label="Previous Hero Skin"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>

          {/* Ornate Circular Golden Medallion */}
          <div
            id="character-medallion"
            onClick={onOpenCharacters}
            className="group relative cursor-pointer"
          >
            {/* Outer Lotus Petal Glow Ring */}
            <div
              className="rounded-full p-1.5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-pulse-glow"
              style={{ width: 'var(--medallion-size)', height: 'var(--medallion-size)' }}
            >
              {/* Inner Golden Ring */}
              <div className="w-full h-full rounded-full p-1 bg-gradient-to-b from-amber-400 via-amber-700 to-amber-950 shadow-inner">
                {/* 3D Character Viewport */}
                <div className="w-full h-full rounded-full bg-gradient-to-b from-purple-950 via-indigo-950 to-neutral-950 overflow-hidden relative border border-amber-400/60 flex items-center justify-center">
                  {/* Radial Sunburst Aura Behind Hero */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.35)_0%,transparent_70%)]" />

                  {/* High Quality 3D Render of Current Mushak Skin */}
                  <img
                    src={SKIN_IMAGES[selectedSkin] || SKIN_IMAGES.classic}
                    alt={currentSkin.name}
                    className="w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-110 animate-float-subtle"
                    referrerPolicy="no-referrer"
                  />

                  {/* Rim Lighting Highlight */}
                  <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Tap to Customize Floating Mini Badge */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 font-black text-[9px] sm:text-[10px] md:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-lg border border-yellow-200 whitespace-nowrap">
              Tap To View
            </div>
          </div>

          {/* Right Arrow: Next Skin */}
          <button
            id="btn-next-skin"
            onClick={handleNextSkin}
            className="absolute -right-11 sm:-right-16 md:-right-20 lg:-right-24 z-20 w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-neutral-900/80 hover:bg-neutral-800 active:scale-90 border-2 border-amber-400/80 text-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] backdrop-blur-md cursor-pointer transition-transform"
            aria-label="Next Hero Skin"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
        </div>

        {/* Selected Skin Name Banner */}
        <div
          onClick={onOpenCharacters}
          className="mt-2.5 sm:mt-3 flex items-center gap-1.5 bg-gradient-to-r from-red-950/90 via-amber-950/90 to-red-950/90 border border-amber-400/80 px-4 py-0.5 sm:px-6 sm:py-1 md:px-8 md:py-1.5 rounded-full shadow-lg cursor-pointer hover:border-amber-300 transition-colors"
        >
          <span className="text-[10px] sm:text-xs text-amber-400">❖</span>
          <span className="text-xs sm:text-sm md:text-base font-bold text-amber-200 font-festive tracking-wider uppercase">
            {currentSkin.name}
          </span>
          <span className="text-[10px] sm:text-xs text-amber-400">❖</span>
        </div>

        {/* Skin Carousel Dots Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 mt-1.5 sm:mt-2">
          {SKIN_ORDER.map((skinKey) => (
            <button
              key={skinKey}
              onClick={() => onSelectSkin?.(skinKey)}
              aria-label={`Select ${SKINS[skinKey].name}`}
              className={`transition-all rounded-full ${
                skinKey === selectedSkin
                  ? 'w-5 h-1.5 sm:w-7 sm:h-2 md:w-9 md:h-2.5 bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                  : 'w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-amber-500/40 hover:bg-amber-400/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 5: PRIMARY CALL-TO-ACTION (CTA) - "TAP TO PLAY"                     */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full px-4 flex flex-col items-center py-1 sm:py-2">
        <button
          id="main-menu-play-btn"
          onClick={handlePlay}
          style={{
            maxWidth: 'var(--btn-play-max-w)',
            paddingTop: 'var(--btn-play-py)',
            paddingBottom: 'var(--btn-play-py)',
          }}
          className={`w-full px-6 sm:px-8 md:px-10 rounded-full gold-embossed-button border-2 sm:border-3 border-yellow-200 font-black font-festive tracking-widest uppercase cursor-pointer flex items-center justify-between gap-3 text-neutral-950 relative overflow-hidden transition-all duration-200 ${
            isPressingPlay ? 'scale-95 brightness-110' : 'hover:brightness-105'
          }`}
        >
          {/* Shimmer Sweep Animation Overlay */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />

          {/* Left Lotus Blossom Flank */}
          <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow relative z-10">
            🪷
          </span>

          {/* Main Action Text with 3D Emboss Feel */}
          <div className="flex flex-col items-center relative z-10">
            <span
              className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] text-amber-950 font-black tracking-widest leading-none"
              style={{ fontSize: 'var(--btn-play-font)' }}
            >
              TAP TO PLAY
            </span>
          </div>

          {/* Right Lotus Blossom Flank */}
          <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow relative z-10">
            🪷
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 6: BOTTOM NAVIGATION BAR (HEROES, GUIDE, RANKS, SETTINGS)           */}
      {/* ========================================================================= */}
      <div
        className="relative z-10 w-full px-3 pt-1 pb-1.5 sm:pb-2"
        style={{ maxWidth: 'var(--nav-max-w)' }}
      >
        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {/* Button: Heroes */}
          <button
            id="btn-characters"
            onClick={() => {
              sound.playButtonClick();
              onOpenCharacters();
            }}
            style={{ paddingTop: 'var(--nav-btn-py)', paddingBottom: 'var(--nav-btn-py)' }}
            className="group bg-gradient-to-b from-neutral-900/90 to-amber-950/80 hover:from-neutral-800 hover:to-amber-900/90 active:scale-95 border border-amber-500/50 rounded-2xl md:rounded-3xl px-1 sm:px-2 flex flex-col items-center justify-center text-amber-200 shadow-lg shadow-black/60 backdrop-blur-md transition-all cursor-pointer"
          >
            <div
              className="rounded-xl md:rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:text-yellow-300 mb-1 transition-colors"
              style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)' }}
            >
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wide font-festive">
              Heroes
            </span>
          </button>

          {/* Button: Guide */}
          <button
            id="btn-tutorial"
            onClick={() => {
              sound.playButtonClick();
              onOpenTutorial();
            }}
            style={{ paddingTop: 'var(--nav-btn-py)', paddingBottom: 'var(--nav-btn-py)' }}
            className="group bg-gradient-to-b from-neutral-900/90 to-amber-950/80 hover:from-neutral-800 hover:to-amber-900/90 active:scale-95 border border-amber-500/50 rounded-2xl md:rounded-3xl px-1 sm:px-2 flex flex-col items-center justify-center text-amber-200 shadow-lg shadow-black/60 backdrop-blur-md transition-all cursor-pointer"
          >
            <div
              className="rounded-xl md:rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:text-yellow-300 mb-1 transition-colors"
              style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)' }}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wide font-festive">
              Guide
            </span>
          </button>

          {/* Button: Ranks */}
          <button
            id="btn-leaderboard"
            onClick={() => {
              sound.playButtonClick();
              onOpenLeaderboard();
            }}
            style={{ paddingTop: 'var(--nav-btn-py)', paddingBottom: 'var(--nav-btn-py)' }}
            className="group bg-gradient-to-b from-neutral-900/90 to-amber-950/80 hover:from-neutral-800 hover:to-amber-900/90 active:scale-95 border border-amber-500/50 rounded-2xl md:rounded-3xl px-1 sm:px-2 flex flex-col items-center justify-center text-amber-200 shadow-lg shadow-black/60 backdrop-blur-md transition-all cursor-pointer"
          >
            <div
              className="rounded-xl md:rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:text-yellow-300 mb-1 transition-colors"
              style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)' }}
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wide font-festive">
              Ranks
            </span>
          </button>

          {/* Button: Settings */}
          <button
            id="btn-settings"
            onClick={() => {
              sound.playButtonClick();
              onOpenSettings();
            }}
            style={{ paddingTop: 'var(--nav-btn-py)', paddingBottom: 'var(--nav-btn-py)' }}
            className="group bg-gradient-to-b from-neutral-900/90 to-amber-950/80 hover:from-neutral-800 hover:to-amber-900/90 active:scale-95 border border-amber-500/50 rounded-2xl md:rounded-3xl px-1 sm:px-2 flex flex-col items-center justify-center text-amber-200 shadow-lg shadow-black/60 backdrop-blur-md transition-all cursor-pointer"
          >
            <div
              className="rounded-xl md:rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:text-yellow-300 mb-1 transition-colors"
              style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)' }}
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wide font-festive">
              Settings
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 7: FOOTER CELEBRATION MOTIF                                         */}
      {/* ========================================================================= */}
      <div className="relative z-10 pb-2 flex items-center justify-center gap-2 text-[9px] sm:text-xs md:text-sm text-amber-200/60 font-festive tracking-widest uppercase">
        <span>More Than A Game</span>
        <span className="text-amber-400 font-yatra text-xs sm:text-sm">॥ ॐ ॥</span>
        <span>A Celebration</span>
      </div>
    </div>
  );
};
