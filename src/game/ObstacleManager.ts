import { Obstacle, ObstacleType } from '../types';
import { GAME_WIDTH } from './constants';
import { TerrainManager } from './TerrainManager';

export class ObstacleManager {
  public gameWidth: number = GAME_WIDTH;
  private obstacles: Obstacle[] = [];
  private nextId: number = 1;
  private lastSpawnX: number = 0;
  private minSpacing: number = 420;

  constructor() {
    this.reset();
  }

  public setGameWidth(w: number): void {
    this.gameWidth = w;
  }

  /**
   * Shift all existing obstacles when orientation/viewport width changes
   * during an active run so relative distance to Mushak is seamlessly preserved.
   */
  public shiftAll(deltaX: number): void {
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].x += deltaX;
    }
    this.lastSpawnX += deltaX;
  }

  public reset(): void {
    this.obstacles = [];
    this.nextId = 1;
    this.lastSpawnX = this.gameWidth * 0.9;
    this.minSpacing = 440;
  }

  public update(
    scrollSpeed: number,
    dt: number,
    distance: number,
    terrain: TerrainManager,
    playerX: number
  ): { passedCount: number } {
    const shift = scrollSpeed * dt;
    let passedCount = 0;

    // Shift existing obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      const obs = this.obstacles[i];
      obs.x -= shift;

      // Update Y to match terrain height at obstacle center
      const ground = terrain.getGroundAt(obs.x + obs.width * 0.5);
      if (!ground.isGap) {
        obs.y = ground.y - obs.height;
      }

      // Check if player passed obstacle cleanly
      if (!obs.passed && obs.x + obs.width < playerX) {
        obs.passed = true;
        passedCount++;
      }
    }

    this.lastSpawnX -= shift;

    // Filter off-screen obstacles
    this.obstacles = this.obstacles.filter((obs) => obs.x + obs.width > -150);

    // Difficulty curve based on distance
    const difficulty = Math.min(1.0, distance / 2500);
    this.minSpacing = 440 - difficulty * 140; // 440 down to 300px

    // Spawn new obstacles ahead of the screen
    if (this.lastSpawnX < this.gameWidth + 300) {
      this.trySpawn(distance, terrain);
    }

    return { passedCount };
  }

  private trySpawn(distance: number, terrain: TerrainManager): void {
    // Don't spawn immediately in the first 80m so players get a friendly start
    if (distance < 80) return;

    const spawnX = Math.max(this.gameWidth + 80, this.lastSpawnX + this.minSpacing + Math.random() * 180);
    const ground = terrain.getGroundAt(spawnX + 30);

    // Never spawn an obstacle over or right next to a gap!
    if (ground.isGap) return;
    const groundBefore = terrain.getGroundAt(spawnX - 40);
    const groundAfter = terrain.getGroundAt(spawnX + 100);
    if (groundBefore.isGap || groundAfter.isGap) return;

    // Select obstacle type based on distance and variety
    const types: ObstacleType[] = ['crate', 'stone', 'pot'];
    if (distance > 300) types.push('cart');
    if (distance > 500) types.push('flower_hurdle');

    const selectedType = types[Math.floor(Math.random() * types.length)];
    let width = 56;
    let height = 56;

    switch (selectedType) {
      case 'crate':
        width = 54;
        height = 54;
        break;
      case 'stone':
        width = 62;
        height = 48;
        break;
      case 'cart':
        width = 78;
        height = 60;
        break;
      case 'pot':
        width = 46;
        height = 56;
        break;
      case 'flower_hurdle':
        width = 60;
        height = 52;
        break;
    }

    const groundInfo = terrain.getGroundAt(spawnX + width * 0.5);
    const obsY = groundInfo.y - height;

    this.obstacles.push({
      id: this.nextId++,
      type: selectedType,
      x: spawnX,
      y: obsY,
      width,
      height,
      cleared: false,
      passed: false,
    });

    this.lastSpawnX = spawnX;
  }

  public checkCollision(playerBox: { x: number; y: number; width: number; height: number }): Obstacle | null {
    for (const obs of this.obstacles) {
      // Forgiving inner obstacle hitbox (approx 75% of visual footprint)
      const insetX = obs.width * 0.12;
      const insetY = obs.height * 0.12;
      const ox = obs.x + insetX;
      const oy = obs.y + insetY;
      const ow = obs.width - insetX * 2;
      const oh = obs.height - insetY * 2;

      if (
        playerBox.x < ox + ow &&
        playerBox.x + playerBox.width > ox &&
        playerBox.y < oy + oh &&
        playerBox.y + playerBox.height > oy
      ) {
        return obs;
      }
    }
    return null;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const obs of this.obstacles) {
      ctx.save();
      ctx.translate(obs.x, obs.y);

      switch (obs.type) {
        case 'crate': {
          // Wooden festival crate with brass corner brackets
          ctx.fillStyle = '#b45309'; // Warm teak wood
          ctx.fillRect(0, 0, obs.width, obs.height);

          // Wood planks
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(0, 0, obs.width, obs.height);
          ctx.beginPath();
          ctx.moveTo(0, obs.height * 0.5);
          ctx.lineTo(obs.width, obs.height * 0.5);
          ctx.moveTo(0, 0);
          ctx.lineTo(obs.width, obs.height);
          ctx.stroke();

          // Brass corners
          ctx.fillStyle = '#f59e0b';
          const b = 8;
          ctx.fillRect(0, 0, b, b);
          ctx.fillRect(obs.width - b, 0, b, b);
          ctx.fillRect(0, obs.height - b, b, b);
          ctx.fillRect(obs.width - b, obs.height - b, b, b);

          // Golden lotus emblem in center
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(obs.width * 0.5, obs.height * 0.5, 7, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'stone': {
          // Carved temple stone block with ornate relief
          ctx.fillStyle = '#78716c';
          ctx.beginPath();
          ctx.roundRect(0, 4, obs.width, obs.height - 4, 8);
          ctx.fill();

          // Stone highlights & cracks
          ctx.strokeStyle = '#a8a29e';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Carved decorative ring
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(obs.width * 0.5, obs.height * 0.5 + 2, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'cart': {
          // Decorative festival handcart
          // Cart bed
          ctx.fillStyle = '#92400e';
          ctx.fillRect(8, 6, obs.width - 16, 26);
          // Flower garland on cart
          ctx.fillStyle = '#f59e0b';
          for (let f = 12; f < obs.width - 12; f += 12) {
            ctx.beginPath();
            ctx.arc(f, 6, 5, 0, Math.PI * 2);
            ctx.fill();
          }
          // Cart wheels
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(20, obs.height - 14, 14, 0, Math.PI * 2);
          ctx.arc(obs.width - 20, obs.height - 14, 14, 0, Math.PI * 2);
          ctx.fill();
          // Brass wheel hubs
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(20, obs.height - 14, 5, 0, Math.PI * 2);
          ctx.arc(obs.width - 20, obs.height - 14, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'pot': {
          // Traditional sacred festival pot (Handi / Kalash)
          // Terracotta pot belly
          ctx.fillStyle = '#c2410c';
          ctx.beginPath();
          ctx.ellipse(obs.width * 0.5, obs.height * 0.62, obs.width * 0.44, obs.height * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();

          // Neck & rim
          ctx.fillStyle = '#9a3412';
          ctx.fillRect(obs.width * 0.3, obs.height * 0.22, obs.width * 0.4, 8);
          ctx.beginPath();
          ctx.ellipse(obs.width * 0.5, obs.height * 0.22, obs.width * 0.24, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Sacred Rangoli band / Swastik motif
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(obs.width * 0.2, obs.height * 0.55, obs.width * 0.6, 5);

          // Mango leaves & Coconut on top!
          ctx.fillStyle = '#16a34a'; // leaves
          ctx.beginPath();
          ctx.ellipse(obs.width * 0.36, obs.height * 0.16, 4, 10, -0.4, 0, Math.PI * 2);
          ctx.ellipse(obs.width * 0.64, obs.height * 0.16, 4, 10, 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Coconut
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(obs.width * 0.5, obs.height * 0.12, 7, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'flower_hurdle': {
          // Festival floral arch hurdle
          ctx.fillStyle = '#78350f'; // Bamboo posts
          ctx.fillRect(4, 8, 8, obs.height - 8);
          ctx.fillRect(obs.width - 12, 8, 8, obs.height - 8);

          // Top cross beam
          ctx.fillRect(2, 6, obs.width - 4, 10);

          // Marigold & rose garland swag
          ctx.fillStyle = '#f59e0b';
          for (let g = 8; g <= obs.width - 8; g += 9) {
            ctx.beginPath();
            ctx.arc(g, 16 + Math.sin((g / obs.width) * Math.PI) * 10, 5, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
      }

      ctx.restore();
    }

    ctx.restore();
  }
}
