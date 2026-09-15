import { SoundManager } from '../audio/SoundManager';
import { CharacterSkin, GameStats, LocationTheme } from '../types';
import { BackgroundRenderer } from './BackgroundRenderer';
import { CollectibleManager } from './CollectibleManager';
import { GAME_HEIGHT, GAME_WIDTH, PHYSICS, THEME_THRESHOLDS, VALUES } from './constants';
import { ObstacleManager } from './ObstacleManager';
import { ParticleSystem } from './ParticleSystem';
import { Player } from './Player';
import { TerrainManager } from './TerrainManager';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  public width: number = GAME_WIDTH;
  public height: number = GAME_HEIGHT;

  // Subsystems
  public player: Player;
  public terrain: TerrainManager;
  public obstacles: ObstacleManager;
  public collectibles: CollectibleManager;
  public particles: ParticleSystem;
  public background: BackgroundRenderer;
  public sound: SoundManager;

  // Run stats
  public score: number = 0;
  public bestScore: number = 0;
  public startingBestScore: number = 0;
  public distance: number = 0;
  public modaks: number = 0;
  public combo: number = 0;
  public comboMultiplier: number = 1;
  public comboTimer: number = 0;
  public festivalMeter: number = 0;
  public isMahotsav: boolean = false;
  public mahotsavTimer: number = 0;
  public hasShield: boolean = false;
  public currentTheme: LocationTheme = 'festival_street';

  // State
  public isRunning: boolean = false;
  public isPaused: boolean = false;
  public currentSkin: CharacterSkin = 'classic';
  public reducedEffects: boolean = false;

  // Camera & Shake
  private cameraX: number = 0;
  private cameraShake: number = 0;
  private cameraOffsetY: number = 0;

  // Dedicated Landscape Viewport State
  public isLandscapeMode: boolean = false;
  public cameraViewY: number = 0;
  public viewHeight: number = GAME_HEIGHT;
  public viewWidth: number = GAME_WIDTH;

  // Callback to update React HUD
  public onStatsUpdate?: (stats: GameStats) => void;
  public onGameOver?: (finalStats: GameStats) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context not supported');
    }
    this.ctx = context;

    this.sound = SoundManager.getInstance();
    this.particles = new ParticleSystem();
    this.terrain = new TerrainManager();
    this.obstacles = new ObstacleManager();
    this.collectibles = new CollectibleManager();
    this.background = new BackgroundRenderer();

    const startX = GAME_WIDTH * PHYSICS.PLAYER_X_PERCENT;
    const startY = this.terrain.baseGroundY - 80;
    this.player = new Player(startX, startY);

    // Load saved best score
    const savedBest = localStorage.getItem('mushak_best_score');
    this.bestScore = savedBest ? parseInt(savedBest, 10) : 0;
  }

  public setSkin(skin: CharacterSkin): void {
    this.currentSkin = skin;
    this.player.skin = skin;
  }

  public resize(displayWidth: number, displayHeight: number): void {
    if (!displayWidth || !displayHeight) return;
    const aspect = displayWidth / displayHeight;
    const isLandscape = aspect >= 1.25;

    this.isLandscapeMode = isLandscape;

    if (isLandscape) {
      // LANDSCAPE VIEWPORT:
      // Keep height framed comfortably around the action (920 units)
      // so Mushak, obstacles, and collectibles are prominent and readable.
      this.viewHeight = 920;
      this.viewWidth = Math.round(this.viewHeight * aspect);
      this.width = this.viewWidth;
      this.height = this.viewHeight;
      this.cameraViewY = 480;
    } else {
      // PORTRAIT VIEWPORT:
      // Standard GAME_HEIGHT (1600) with aspect-adjusted width
      this.viewHeight = GAME_HEIGHT;
      this.viewWidth = Math.round(GAME_HEIGHT * aspect);
      this.width = this.viewWidth;
      this.height = GAME_HEIGHT;
      this.cameraViewY = 0;
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.terrain.setGameWidth(this.width);
    this.obstacles.setGameWidth(this.width);
    this.collectibles.setGameWidth(this.width);
    this.background.setGameWidth(this.width);

    // Calculate Mushak target X position:
    // In landscape: 27% from left edge (generous road ahead)
    // In portrait: 26% from left edge (capped at 320 for narrow portrait)
    const targetPlayerX = isLandscape
      ? Math.round(this.width * 0.27)
      : Math.min(320, Math.round(this.width * PHYSICS.PLAYER_X_PERCENT));

    if (!this.isRunning) {
      const startY = this.terrain.baseGroundY - 80;
      this.player.reset(targetPlayerX, startY, this.currentSkin);
      this.render();
    } else {
      // Active run: smoothly shift player.x and offset obstacles/collectibles
      const deltaX = targetPlayerX - this.player.x;
      if (Math.abs(deltaX) > 4) {
        this.player.x = targetPlayerX;
        this.obstacles.shiftAll(deltaX);
        this.collectibles.shiftAll(deltaX);
      }
    }
  }

  public startRun(): void {
    this.startingBestScore = this.bestScore;
    this.score = 0;
    this.distance = 0;
    this.modaks = 0;
    this.combo = 0;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
    this.festivalMeter = 0;
    this.isMahotsav = false;
    this.mahotsavTimer = 0;
    this.hasShield = false;
    this.currentTheme = 'festival_street';
    this.cameraX = 0;
    this.cameraShake = 0;
    this.cameraOffsetY = 0;

    const startX = this.isLandscapeMode
      ? Math.round(this.width * 0.27)
      : Math.min(320, Math.round(this.width * PHYSICS.PLAYER_X_PERCENT));
    const startY = this.terrain.baseGroundY - 80;
    this.player.reset(startX, startY, this.currentSkin);
    this.terrain.reset();
    this.obstacles.reset();
    this.collectibles.reset();
    this.particles.reset();

    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();

    this.sound.startMusic(false);
    this.emitStats();
    this.loop(this.lastTime);
  }

  public pause(): void {
    this.isPaused = true;
    this.sound.stopMusic();
  }

  public resume(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.sound.startMusic(this.isMahotsav);
    this.loop(this.lastTime);
  }

  public stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.sound.stopMusic();
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public handleJumpInput(): void {
    if (!this.isRunning || this.isPaused || this.player.isDead) return;

    this.sound.initOnGesture();
    const jumped = this.player.jump(this.particles);
    if (jumped) {
      this.sound.playJump(this.player.jumpCountUsed);
      // Small upward camera anticipation kick
      this.cameraOffsetY = -6;
      this.emitStats();
    }
  }

  private loop = (timestamp: number): void => {
    if (!this.isRunning || this.isPaused) return;

    const rawDt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    // Clamp delta time to avoid huge leaps when tab is hidden
    const dt = Math.min(rawDt, 0.05);

    this.update(dt);
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    // 1. Calculate current running speed based on distance and Mahotsav mode
    let currentSpeed = PHYSICS.BASE_SPEED + (this.distance / 100) * PHYSICS.SPEED_INCREASE_RATE;
    if (currentSpeed > PHYSICS.MAX_SPEED) {
      currentSpeed = PHYSICS.MAX_SPEED;
    }
    if (this.isMahotsav) {
      currentSpeed *= PHYSICS.MAHOTSAV_SPEED_MULT;
    }

    // Distance update
    this.distance += (currentSpeed * dt) / 10;
    this.cameraX += currentSpeed * dt;

    // Score from running distance
    const scoreFromDistance = Math.floor(this.distance / VALUES.DISTANCE_POINT_INTERVAL);
    this.score = scoreFromDistance + this.modaks * VALUES.MODAK_POINTS;
    if (this.isMahotsav) {
      this.score += Math.floor(currentSpeed * dt * 0.1);
    }

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('mushak_best_score', String(this.bestScore));
    }

    // 2. Location theme progression based on distance
    for (const t of THEME_THRESHOLDS) {
      if (this.distance >= t.distance) {
        this.currentTheme = t.theme;
      }
    }

    // 3. Mahotsav Mode Timer
    if (this.isMahotsav) {
      this.mahotsavTimer -= dt;
      const maxY = this.isLandscapeMode ? this.cameraViewY + this.viewHeight * 0.7 : GAME_HEIGHT;
      this.particles.emitMahotsavCelebration(this.width, maxY);
      if (this.mahotsavTimer <= 0) {
        this.isMahotsav = false;
        this.player.isMahotsav = false;
        this.sound.startMusic(false);
      }
    }

    // 4. Combo Timer
    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.comboMultiplier = 1;
      }
    }

    // 5. Update Terrain
    this.terrain.update(currentSpeed, dt, this.distance);

    // 6. Update Player Physics & Ground Collision
    const groundInfo = this.terrain.getGroundAt(this.player.x + this.player.width * 0.5);

    // If over a gap and player fell below ground level -> Game Over fall into river
    if (groundInfo.isGap && this.player.y > this.terrain.baseGroundY + 140) {
      this.triggerGameOver('Fell into sacred water');
      return;
    }

    this.player.update(dt, groundInfo.y, this.particles);

    // 7. Update Obstacles
    const { passedCount } = this.obstacles.update(
      currentSpeed,
      dt,
      this.distance,
      this.terrain,
      this.player.x
    );

    if (passedCount > 0) {
      // Reward for leaping over obstacles cleanly!
      this.increaseCombo(1);
      this.particles.addFloatingText('+50 CLEAR!', this.player.x + 30, this.player.y - 30, '#a855f7');
      this.score += 50 * this.comboMultiplier;
    }

    // Check Obstacle Collision
    const playerHitbox = this.player.getHitbox();
    const hitObstacle = this.obstacles.checkCollision(playerHitbox);
    if (hitObstacle && !this.player.isDead) {
      if (this.hasShield) {
        // Shield absorbs the collision!
        this.hasShield = false;
        this.player.hasShield = false;
        this.sound.playCollision();
        this.particles.emitCollectBurst(hitObstacle.x + 25, hitObstacle.y + 25, '#fbbf24', 20);
        this.particles.addFloatingText('SHIELD SAVED!', this.player.x, this.player.y - 40, '#fef08a');
        hitObstacle.x = -200; // remove hit obstacle
        this.cameraShake = 12;
      } else if (this.isMahotsav) {
        // In Mahotsav mode, Mushak is so joyful obstacles get tossed aside!
        this.sound.playCollision();
        this.particles.emitCollectBurst(hitObstacle.x + 25, hitObstacle.y + 25, '#f59e0b', 16);
        this.particles.addFloatingText('BLESSED SMASH!', this.player.x, this.player.y - 40, '#f59e0b');
        hitObstacle.x = -200;
        this.cameraShake = 6;
      } else {
        // Collision -> Game Over
        this.triggerGameOver('Hit obstacle');
        return;
      }
    }

    // 8. Update Collectibles
    this.collectibles.update(
      currentSpeed,
      dt,
      this.distance,
      this.terrain,
      this.isMahotsav,
      { x: this.player.x, y: this.player.y }
    );

    const gathered = this.collectibles.checkCollisions(playerHitbox);
    for (const item of gathered) {
      this.handleItemCollected(item);
    }

    // 9. Floating gentle flower petals in atmosphere
    if (!this.reducedEffects && Math.random() < 0.25) {
      const petalY = this.isLandscapeMode
        ? this.cameraViewY + Math.random() * (this.viewHeight * 0.75)
        : Math.random() * (GAME_HEIGHT * 0.7);
      this.particles.emitPetals(this.width + 20, petalY, 1);
    }

    // 10. Update Particles
    this.particles.update(dt);

    // 11. Camera Spring & Shake decay
    if (this.cameraShake > 0) {
      this.cameraShake = Math.max(0, this.cameraShake - dt * 25);
    }
    this.cameraOffsetY += (0 - this.cameraOffsetY) * Math.min(1, dt * 6);

    this.emitStats();
  }

  private handleItemCollected(item: { type: string; x: number; y: number }): void {
    this.sound.playCollect(item.type as any);

    if (item.type === 'modak') {
      this.modaks++;
      const pts = VALUES.MODAK_POINTS * this.comboMultiplier * (this.isMahotsav ? 2 : 1);
      this.score += pts;
      this.increaseFestivalMeter(VALUES.MODAK_METER_GAIN);
      this.increaseCombo(1);
      this.particles.emitCollectBurst(item.x, item.y, '#f59e0b', 12);
      this.particles.addFloatingText(`+${pts}`, item.x, item.y - 15, '#fbbf24');
    } else if (item.type === 'durva') {
      // Boosts combo significantly!
      this.increaseCombo(3);
      this.increaseFestivalMeter(VALUES.DURVA_METER_GAIN);
      this.score += VALUES.DURVA_POINTS * this.comboMultiplier;
      this.particles.emitCollectBurst(item.x, item.y, '#22c55e', 14);
      this.particles.addFloatingText(`COMBO +3!`, item.x, item.y - 15, '#4ade80');
    } else if (item.type === 'flower') {
      // Greatly fills the Festival / Utsav meter
      this.increaseFestivalMeter(VALUES.FLOWER_METER_GAIN);
      this.score += VALUES.FLOWER_POINTS * this.comboMultiplier;
      this.increaseCombo(1);
      this.particles.emitCollectBurst(item.x, item.y, '#ec4899', 16);
      this.particles.addFloatingText(`UTSAV +15%!`, item.x, item.y - 15, '#f472b6');
    } else if (item.type === 'diya') {
      // Grants Sacred Shield Protection!
      this.hasShield = true;
      this.player.hasShield = true;
      this.increaseFestivalMeter(VALUES.DIYA_METER_GAIN);
      this.score += VALUES.DIYA_POINTS;
      this.particles.emitCollectBurst(item.x, item.y, '#fef08a', 22);
      this.particles.addFloatingText(`SACRED SHIELD!`, item.x, item.y - 25, '#fef08a');
    }
  }

  private increaseCombo(amount: number = 1): void {
    const prevMult = this.comboMultiplier;
    this.combo += amount;
    this.comboTimer = VALUES.COMBO_TIMEOUT;

    if (this.combo >= 22) {
      this.comboMultiplier = 8;
    } else if (this.combo >= 12) {
      this.comboMultiplier = 4;
    } else if (this.combo >= 5) {
      this.comboMultiplier = 2;
    } else {
      this.comboMultiplier = 1;
    }

    if (this.comboMultiplier > prevMult) {
      this.sound.playComboUp(this.comboMultiplier);
      const label = this.comboMultiplier >= 8 ? 'SUPER COMBO ×8!' : `COMBO ×${this.comboMultiplier}!`;
      this.particles.addFloatingText(label, this.player.x + 30, this.player.y - 50, '#f59e0b');
    }
  }

  private increaseFestivalMeter(amount: number): void {
    if (this.isMahotsav) return; // already active

    this.festivalMeter = Math.min(100, this.festivalMeter + amount);

    if (this.festivalMeter >= 100) {
      this.activateMahotsavMode();
    }
  }

  public activateMahotsavMode(): void {
    this.isMahotsav = true;
    this.mahotsavTimer = VALUES.MAHOTSAV_DURATION;
    this.festivalMeter = 0;
    this.player.isMahotsav = true;
    this.sound.playMahotsavStart();
    this.sound.startMusic(true);
    this.cameraShake = 8;

    const textY = this.isLandscapeMode ? this.cameraViewY + this.viewHeight * 0.35 : GAME_HEIGHT * 0.35;
    this.particles.addFloatingText('✨ MAHOTSAV MODE! ✨', this.width * 0.5, textY, '#fbbf24');
  }

  private triggerGameOver(reason: string): void {
    this.sound.playCollision();
    this.player.isDead = true;
    this.cameraShake = 16;
    this.isRunning = false;
    this.sound.stopMusic();

    const isNewBest = this.score > this.startingBestScore && this.score > 0;

    const currentStats: GameStats = {
      score: this.score,
      bestScore: this.bestScore,
      distance: Math.floor(this.distance),
      modaks: this.modaks,
      combo: this.combo,
      comboMultiplier: this.comboMultiplier,
      festivalMeter: this.festivalMeter,
      isMahotsav: this.isMahotsav,
      mahotsavTimeLeft: Math.max(0, this.mahotsavTimer),
      hasShield: this.hasShield,
      currentTheme: this.currentTheme,
      jumpsRemaining: this.player.jumpsRemaining,
      isNewBest,
    };

    // Give a brief gentle pause so player sees the impact before modal shows
    window.setTimeout(() => {
      if (this.onGameOver) {
        this.onGameOver(currentStats);
      }
    }, 650);
  }

  private emitStats(): void {
    if (this.onStatsUpdate) {
      this.onStatsUpdate({
        score: this.score,
        bestScore: this.bestScore,
        distance: Math.floor(this.distance),
        modaks: this.modaks,
        combo: this.combo,
        comboMultiplier: this.comboMultiplier,
        festivalMeter: this.festivalMeter,
        isMahotsav: this.isMahotsav,
        mahotsavTimeLeft: Math.max(0, this.mahotsavTimer),
        hasShield: this.hasShield,
        currentTheme: this.currentTheme,
        jumpsRemaining: this.player.jumpsRemaining,
      });
    }
  }

  public render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();

    // Camera shake & vertical anticipation
    let transX = 0;
    let transY = -this.cameraViewY;

    if (this.cameraShake > 0) {
      transX += (Math.random() - 0.5) * this.cameraShake;
      transY += (Math.random() - 0.5) * this.cameraShake + this.cameraOffsetY;
    } else if (this.cameraOffsetY !== 0) {
      transY += this.cameraOffsetY;
    }

    ctx.translate(transX, transY);

    // 1. Background Layers
    this.background.render(
      ctx,
      this.cameraX,
      performance.now() / 1000,
      this.currentTheme,
      this.isMahotsav,
      this.cameraViewY,
      this.viewHeight
    );

    // 2. Terrain / Road
    this.terrain.render(ctx, performance.now() / 1000);

    // 3. Obstacles
    this.obstacles.render(ctx);

    // 4. Collectibles
    this.collectibles.render(ctx);

    // 5. Player (Mushak)
    this.player.render(ctx);

    // 6. Particles & Floating Texts
    this.particles.render(ctx);

    // 7. Mahotsav Mode Screen Edge Golden Vignette
    if (this.isMahotsav) {
      const pulse = Math.sin(performance.now() / 150) * 0.15 + 0.35;
      ctx.strokeStyle = `rgba(245, 158, 11, ${pulse})`;
      ctx.lineWidth = 20;
      ctx.strokeRect(10, this.cameraViewY + 10, this.width - 20, this.viewHeight - 20);
    }

    ctx.restore();
  }
}
