import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { GAME_HEIGHT, GAME_WIDTH } from './game/constants';
import { CharacterSkin, GameSettings, GameState, GameStats, ScoreRecord } from './types';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { CountdownOverlay } from './components/CountdownOverlay';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CharactersModal } from './components/CharactersModal';
import { SettingsModal } from './components/SettingsModal';
import { OrientationPrompt } from './components/OrientationPrompt';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { SoundManager } from './audio/SoundManager';
import { FESTIVAL_BG_IMAGE } from './assets/characterAssets';

const DEFAULT_LEADERBOARD: ScoreRecord[] = [
  { id: '1', name: 'Ganpati Bhakt', score: 28560, distance: 2410, modaks: 142, date: 'Festive Record' },
  { id: '2', name: 'Aarav Sharma', score: 21340, distance: 1890, modaks: 104, date: 'Festive Record' },
  { id: '3', name: 'Ananya Iyer', score: 17890, distance: 1540, modaks: 88, date: 'Festive Record' },
  { id: '4', name: 'Rohan Deshmukh', score: 12450, distance: 1120, modaks: 62, date: 'Festive Record' },
  { id: '5', name: 'Pooja Patel', score: 8620, distance: 790, modaks: 45, date: 'Festive Record' },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Device & Orientation detection
  const { isLandscape, isMobileLandscape, isMobilePortrait } = useDeviceOrientation();
  const [showOrientationPrompt, setShowOrientationPrompt] = useState(false);
  const [hasDismissedPrompt, setHasDismissedPrompt] = useState<boolean>(() => {
    return sessionStorage.getItem('mushak_dismiss_orientation') === 'true';
  });

  // States
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isCharactersOpen, setIsCharactersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    const savedSkin = (localStorage.getItem('mushak_skin') as CharacterSkin) || 'classic';
    const savedName = localStorage.getItem('mushak_player_name') || 'Devotee Mushak';
    const savedSound = localStorage.getItem('mushak_sound_enabled');
    const savedMusic = localStorage.getItem('mushak_music_enabled');
    const savedEffects = localStorage.getItem('mushak_reduced_effects');

    return {
      soundEnabled: savedSound !== null ? savedSound === 'true' : true,
      musicEnabled: savedMusic !== null ? savedMusic === 'true' : true,
      reducedEffects: savedEffects === 'true',
      playerName: savedName,
      selectedSkin: savedSkin,
    };
  });

  // Total Lifetime Modaks
  const [totalModaks, setTotalModaks] = useState<number>(() => {
    const saved = localStorage.getItem('mushak_total_modaks');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Leaderboard records
  const [leaderboardRecords, setLeaderboardRecords] = useState<ScoreRecord[]>(() => {
    const saved = localStorage.getItem('mushak_leaderboard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_LEADERBOARD;
      }
    }
    return DEFAULT_LEADERBOARD;
  });

  // Live game stats
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    bestScore: 0,
    distance: 0,
    modaks: 0,
    combo: 0,
    comboMultiplier: 1,
    festivalMeter: 0,
    isMahotsav: false,
    mahotsavTimeLeft: 0,
    hasShield: false,
    currentTheme: 'festival_street',
    jumpsRemaining: 3,
  });

  // Initialize Game Engine on Canvas mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current);
    engine.setSkin(settings.selectedSkin);
    engine.reducedEffects = settings.reducedEffects;

    // Hook listeners
    engine.onStatsUpdate = (updatedStats) => {
      setStats(updatedStats);
    };

    engine.onGameOver = (finalStats) => {
      setStats(finalStats);
      setGameState('GAME_OVER');

      // Update total modaks
      setTotalModaks((prev) => {
        const next = prev + finalStats.modaks;
        localStorage.setItem('mushak_total_modaks', String(next));
        return next;
      });
    };

    engineRef.current = engine;

    // Handle dynamic viewport sizing
    const handleResize = () => {
      const container = stageRef.current || canvasRef.current?.parentElement;
      if (container && engineRef.current) {
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          engineRef.current.resize(rect.width, rect.height);
        }
      }
    };

    handleResize();

    let resizeObserver: ResizeObserver | null = null;
    const container = stageRef.current || canvasRef.current?.parentElement;
    if (container && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', handleResize);
    }

    // Initial render of background/menu view
    engine.render();

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }
      engine.stop();
    };
  }, []);

  // Update engine skin / settings when changed
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSkin(settings.selectedSkin);
      engineRef.current.reducedEffects = settings.reducedEffects;
    }
    localStorage.setItem('mushak_skin', settings.selectedSkin);
    localStorage.setItem('mushak_reduced_effects', String(settings.reducedEffects));
    localStorage.setItem('mushak_sound_enabled', String(settings.soundEnabled));
    localStorage.setItem('mushak_music_enabled', String(settings.musicEnabled));

    const sound = SoundManager.getInstance();
    sound.setSoundEnabled(settings.soundEnabled);
    sound.setMusicEnabled(settings.musicEnabled);
  }, [settings]);

  // Re-adjust engine size immediately whenever orientation changes without resetting game state
  useEffect(() => {
    const container = stageRef.current || canvasRef.current?.parentElement;
    if (container && engineRef.current) {
      const handleOrientationResize = () => {
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          engineRef.current?.resize(rect.width, rect.height);
        }
      };

      // Call immediately and again on next frame after layout classes apply
      handleOrientationResize();
      const raf = requestAnimationFrame(handleOrientationResize);
      return () => cancelAnimationFrame(raf);
    }
  }, [isLandscape, isMobileLandscape]);

  // Jump Input Handler
  const handleJump = useCallback(() => {
    if (gameState === 'PLAYING' && engineRef.current) {
      engineRef.current.handleJumpInput();
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'PLAYING') {
          handleJump();
        } else if (gameState === 'MENU' && !isLeaderboardOpen && !isCharactersOpen && !isSettingsOpen && !isTutorialOpen) {
          handleStartCountdown();
        }
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (gameState === 'PLAYING') {
          handlePause();
        } else if (gameState === 'PAUSED') {
          handleResume();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleJump, isLeaderboardOpen, isCharactersOpen, isSettingsOpen, isTutorialOpen]);

  // Game Flow actions
  const proceedToCountdown = () => {
    setShowOrientationPrompt(false);
    setGameState('COUNTDOWN');
  };

  const handleStartCountdown = () => {
    SoundManager.getInstance().initOnGesture();
    SoundManager.getInstance().playButtonClick();
    if (isMobilePortrait && !hasDismissedPrompt) {
      setShowOrientationPrompt(true);
    } else {
      proceedToCountdown();
    }
  };

  const handleContinueInPortrait = () => {
    setHasDismissedPrompt(true);
    sessionStorage.setItem('mushak_dismiss_orientation', 'true');
    proceedToCountdown();
  };

  const handleOrientationPromptDismiss = () => {
    setShowOrientationPrompt(false);
    if (gameState === 'MENU') {
      proceedToCountdown();
    }
  };

  const handleStartRun = () => {
    setGameState('PLAYING');
    if (engineRef.current) {
      engineRef.current.startRun();
    }
  };

  const handlePause = () => {
    if (gameState !== 'PLAYING') return;
    SoundManager.getInstance().playButtonClick();
    if (engineRef.current) {
      engineRef.current.pause();
    }
    setGameState('PAUSED');
  };

  const handleResume = () => {
    SoundManager.getInstance().playButtonClick();
    if (engineRef.current) {
      engineRef.current.resume();
    }
    setGameState('PLAYING');
  };

  const handleRestart = () => {
    SoundManager.getInstance().playButtonClick();
    if (engineRef.current) {
      engineRef.current.stop();
    }
    handleStartCountdown();
  };

  const handleHome = () => {
    SoundManager.getInstance().playButtonClick();
    if (engineRef.current) {
      engineRef.current.stop();
      engineRef.current.render();
    }
    setGameState('MENU');
  };

  const handleSaveScore = (name: string) => {
    localStorage.setItem('mushak_player_name', name);
    setSettings((prev) => ({ ...prev, playerName: name }));

    const newRecord: ScoreRecord = {
      id: Date.now().toString(),
      name,
      score: stats.score,
      distance: stats.distance,
      modaks: stats.modaks,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };

    const updated = [...leaderboardRecords, newRecord]
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    setLeaderboardRecords(updated);
    localStorage.setItem('mushak_leaderboard', JSON.stringify(updated));
  };

  const handleResetProgress = () => {
    localStorage.removeItem('mushak_best_score');
    localStorage.removeItem('mushak_total_modaks');
    localStorage.removeItem('mushak_leaderboard');
    setTotalModaks(0);
    setLeaderboardRecords(DEFAULT_LEADERBOARD);
    setStats((prev) => ({ ...prev, bestScore: 0 }));
    if (engineRef.current) {
      engineRef.current.bestScore = 0;
    }
    setIsSettingsOpen(false);
  };

  return (
    <main
      id="game-viewport-container"
      className="relative w-full h-full min-h-[100dvh] flex items-center justify-center bg-black select-none overflow-hidden touch-none"
      onPointerDown={(e) => {
        // Only trigger jump if target is directly the canvas or game container (not buttons)
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'CANVAS' ||
          target.id === 'game-viewport-container' ||
          target.id === 'hud-touch-area' ||
          target.id === 'game-stage-shell'
        ) {
          handleJump();
        }
      }}
    >
      {/* 1. FULL VIEWPORT FESTIVAL BACKGROUND (Ambient Desktop/Laptop Fill) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#090314]">
        <img
          src={FESTIVAL_BG_IMAGE}
          alt="Festival Atmosphere"
          className="w-full h-full object-cover object-center filter blur-2xl brightness-[0.42] contrast-125 scale-110"
        />
        {/* Festive Midnight Night Sky & Pandal Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080214]/85 via-[#110826]/75 to-[#05010a]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.22)_0%,rgba(0,0,0,0.75)_80%)]" />

        {/* Ambient Warm Gold Bokeh Orbs on Outer Wings */}
        <div className="hidden sm:block absolute top-[12%] left-[4%] w-16 h-16 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
        <div className="hidden sm:block absolute top-[28%] right-[5%] w-20 h-20 rounded-full bg-yellow-400/15 blur-2xl animate-pulse" style={{ animationDelay: '1.4s' }} />
        <div className="hidden sm:block absolute bottom-[22%] left-[6%] w-24 h-24 rounded-full bg-orange-500/15 blur-2xl animate-pulse" style={{ animationDelay: '2.3s' }} />
        <div className="hidden sm:block absolute bottom-[32%] right-[7%] w-18 h-18 rounded-full bg-amber-300/20 blur-xl animate-pulse" style={{ animationDelay: '0.9s' }} />

        {/* Subtle Glowing Sparks & Festive Light Stars */}
        <div className="hidden sm:block absolute top-[18%] left-[7%] w-3 h-3 rounded-full bg-amber-300/70 blur-[1px] shadow-[0_0_12px_#f59e0b] animate-ping" style={{ animationDuration: '4s' }} />
        <div className="hidden sm:block absolute top-[36%] right-[8%] w-3.5 h-3.5 rounded-full bg-yellow-200/60 blur-[1.5px] shadow-[0_0_15px_#fde047] animate-ping" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />
        <div className="hidden sm:block absolute bottom-[28%] left-[9%] w-2.5 h-2.5 rounded-full bg-orange-400/70 blur-[1px] shadow-[0_0_10px_#ea580c] animate-pulse" style={{ animationDelay: '2.5s' }} />
        <div className="hidden sm:block absolute bottom-[42%] right-[10%] w-3 h-3 rounded-full bg-amber-400/60 blur-[1.5px] shadow-[0_0_12px_#fbbf24] animate-pulse" style={{ animationDelay: '1.1s' }} />

        {/* Outer Edge Faint Sacred Temple Silhouette & Garlands */}
        <div className="hidden lg:flex absolute left-4 inset-y-0 flex-col justify-around py-16 opacity-30 text-amber-400 text-sm select-none pointer-events-none">
          <span>🪷</span>
          <span>✦</span>
          <span>🪔</span>
          <span>✦</span>
          <span>🌸</span>
        </div>
        <div className="hidden lg:flex absolute right-4 inset-y-0 flex-col justify-around py-16 opacity-30 text-amber-400 text-sm select-none pointer-events-none">
          <span>🪷</span>
          <span>✦</span>
          <span>🪔</span>
          <span>✦</span>
          <span>🌸</span>
        </div>
      </div>

      {/* 2. CENTERED RESPONSIVE GAME CONTAINER / FULLSCREEN MOBILE LANDSCAPE STAGE */}
      <div
        id="game-stage-shell"
        ref={stageRef}
        className={`relative z-10 flex items-center justify-center overflow-hidden bg-neutral-950 ${
          isMobileLandscape
            ? 'fixed inset-0 w-screen h-[100dvh] max-w-none max-h-none rounded-none border-0 shadow-none'
            : 'w-full h-full sm:w-[clamp(440px,80vw,1040px)] sm:h-[min(calc(100dvh-20px),1020px)] sm:max-w-[min(1040px,calc((100dvh-20px)*1.18))] sm:my-auto mx-auto sm:rounded-3xl shadow-[0_0_70px_rgba(0,0,0,0.95)] sm:border-2 sm:border-amber-500/50'
        }`}
      >
        {/* Core 2D/2.5D Canvas */}
        <canvas
          id="game-canvas"
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="w-full h-full object-cover select-none cursor-pointer block"
        />

        {/* HUD Overlay (Visible during active gameplay and pause) */}
        {gameState === 'PLAYING' && (
          <div id="hud-touch-area" className="absolute inset-0">
            <HUD stats={stats} onPause={handlePause} isLandscape={isLandscape} />
          </div>
        )}

        {/* Countdown Overlay */}
        {gameState === 'COUNTDOWN' && (
          <CountdownOverlay onComplete={handleStartRun} />
        )}

        {/* Main Menu Overlay */}
        {gameState === 'MENU' && (
          <MainMenu
            onStartGame={handleStartCountdown}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenCharacters={() => setIsCharactersOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            bestScore={stats.bestScore}
            selectedSkin={settings.selectedSkin}
            onSelectSkin={(skin) => {
              setSettings((prev) => ({ ...prev, selectedSkin: skin }));
              if (engineRef.current) {
                engineRef.current.setSkin(skin);
              }
            }}
            totalModaks={totalModaks}
          />
        )}

        {/* Pause Modal */}
        {gameState === 'PAUSED' && (
          <PauseModal
            onResume={handleResume}
            onRestart={handleRestart}
            onHome={handleHome}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
          />
        )}

        {/* Game Over Modal */}
        {gameState === 'GAME_OVER' && (
          <GameOverModal
            stats={stats}
            onPlayAgain={handleStartCountdown}
            onHome={handleHome}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onSaveScore={handleSaveScore}
            playerName={settings.playerName}
          />
        )}

        {/* Modal: Leaderboard */}
        {isLeaderboardOpen && (
          <LeaderboardModal
            records={leaderboardRecords}
            onClose={() => setIsLeaderboardOpen(false)}
          />
        )}

        {/* Modal: How To Play / Tutorial */}
        {isTutorialOpen && (
          <HowToPlayModal
            onClose={() => setIsTutorialOpen(false)}
            onPlayDirectly={
              gameState === 'MENU' ? handleStartCountdown : undefined
            }
          />
        )}

        {/* Modal: Characters & Skins */}
        {isCharactersOpen && (
          <CharactersModal
            onClose={() => setIsCharactersOpen(false)}
            selectedSkin={settings.selectedSkin}
            onSelectSkin={(skin) =>
              setSettings((prev) => ({ ...prev, selectedSkin: skin }))
            }
            totalModaks={totalModaks}
          />
        )}

        {/* Modal: Settings */}
        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={(updated) =>
              setSettings((prev) => ({ ...prev, ...updated }))
            }
            onResetProgress={handleResetProgress}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </div>

      {/* Orientation Prompt (Shown when starting game in mobile portrait) */}
      {showOrientationPrompt && (
        <OrientationPrompt
          isLandscape={isLandscape}
          onDismiss={handleOrientationPromptDismiss}
          onContinueInPortrait={handleContinueInPortrait}
        />
      )}
    </main>
  );
}
