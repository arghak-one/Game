import { Collectible, CollectibleType } from '../types';
import { GAME_WIDTH } from './constants';
import { TerrainManager } from './TerrainManager';

export class CollectibleManager {
  public gameWidth: number = GAME_WIDTH;
  private collectibles: Collectible[] = [];
  private nextId: number = 1;
  private lastSpawnX: number = 0;
  private animTime: number = 0;

  constructor() {
    this.reset();
  }

  public setGameWidth(w: number): void {
    this.gameWidth = w;
  }

  public reset(): void {
    this.collectibles = [];
    this.nextId = 1;
    this.lastSpawnX = this.gameWidth * 0.4;
    this.animTime = 0;
  }

  public update(
    scrollSpeed: number,
    dt: number,
    distance: number,
    terrain: TerrainManager,
    isMahotsav: boolean,
    playerPos: { x: number; y: number }
  ): void {
    this.animTime += dt;
    const shift = scrollSpeed * dt;

    // Shift and magnetize
    for (let i = 0; i < this.collectibles.length; i++) {
      const item = this.collectibles[i];
      item.x -= shift;
      item.sparkleTimer += dt;

      // Mahotsav Mode Magnetism: Modaks gently drift toward Mushak!
      if (isMahotsav && !item.collected) {
        const dx = playerPos.x - item.x;
        const dy = playerPos.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 320 && dist > 10) {
          const magnetSpeed = 380;
          item.x += (dx / dist) * magnetSpeed * dt;
          item.y += (dy / dist) * magnetSpeed * dt;
        }
      }
    }

    this.lastSpawnX -= shift;

    // Remove collected or off-screen items
    this.collectibles = this.collectibles.filter(
      (c) => !c.collected && c.x + c.width > -100
    );

    // Spawn new collectible patterns ahead
    if (this.lastSpawnX < this.gameWidth + 400) {
      this.spawnPattern(distance, terrain, isMahotsav);
    }
  }

  private spawnPattern(distance: number, terrain: TerrainManager, isMahotsav: boolean): void {
    const startX = Math.max(this.gameWidth + 60, this.lastSpawnX + 160 + Math.random() * 120);
    const patternType = Math.floor(Math.random() * 5);

    // Pattern 0: Ground straight trail (3-5 modaks)
    // Pattern 1: Jump Arc (parabola of 5-7 items)
    // Pattern 2: High Double-Jump Cluster (requires 2nd or 3rd jump)
    // Pattern 3: Festival Sacred Trio (Durva + Modak + Flower)
    // Pattern 4: Diya blessing (with golden flower arc)

    if (patternType === 0 || isMahotsav) {
      // Modak trail
      const count = isMahotsav ? 6 : 4;
      for (let i = 0; i < count; i++) {
        const x = startX + i * 44;
        const ground = terrain.getGroundAt(x);
        if (!ground.isGap) {
          this.collectibles.push({
            id: this.nextId++,
            type: 'modak',
            x,
            y: ground.y - 42,
            width: 36,
            height: 38,
            collected: false,
            bobOffset: i * 0.4,
            sparkleTimer: Math.random(),
          });
        }
      }
      this.lastSpawnX = startX + count * 44;
    } else if (patternType === 1) {
      // Jump Arc (parabolic rainbow curve)
      const count = 6;
      for (let i = 0; i < count; i++) {
        const x = startX + i * 50;
        const ground = terrain.getGroundAt(x);
        const arcProgress = Math.sin((i / (count - 1)) * Math.PI);
        const yOffset = 42 + arcProgress * 150; // leaps high!

        // Mix modaks with a flower at the peak
        const type: CollectibleType = i === 2 || i === 3 ? 'flower' : 'modak';
        this.collectibles.push({
          id: this.nextId++,
          type,
          x,
          y: ground.y - yOffset,
          width: 36,
          height: 38,
          collected: false,
          bobOffset: i * 0.3,
          sparkleTimer: Math.random(),
        });
      }
      this.lastSpawnX = startX + count * 50;
    } else if (patternType === 2) {
      // High Double/Triple jump cluster (3-4 items high in sky)
      const ground = terrain.getGroundAt(startX);
      const count = 4;
      for (let i = 0; i < count; i++) {
        const x = startX + i * 42;
        this.collectibles.push({
          id: this.nextId++,
          type: i === 1 ? 'durva' : 'modak',
          x,
          y: ground.y - (180 + Math.sin(i) * 30),
          width: 36,
          height: 38,
          collected: false,
          bobOffset: i * 0.5,
          sparkleTimer: Math.random(),
        });
      }
      this.lastSpawnX = startX + count * 42;
    } else if (patternType === 3) {
      // Festival Combo cluster: Durva, Modak, Flower
      const ground = terrain.getGroundAt(startX);
      const types: CollectibleType[] = ['durva', 'modak', 'flower', 'modak'];
      types.forEach((type, idx) => {
        this.collectibles.push({
          id: this.nextId++,
          type,
          x: startX + idx * 46,
          y: ground.y - (50 + idx * 20),
          width: 36,
          height: 38,
          collected: false,
          bobOffset: idx * 0.6,
          sparkleTimer: Math.random(),
        });
      });
      this.lastSpawnX = startX + types.length * 46;
    } else {
      // Diya Blessing (Rare shield/invincibility item!)
      const ground = terrain.getGroundAt(startX);
      this.collectibles.push({
        id: this.nextId++,
        type: 'diya',
        x: startX + 30,
        y: ground.y - 70,
        width: 40,
        height: 42,
        collected: false,
        bobOffset: 0,
        sparkleTimer: 0,
      });

      // Flanked by two modaks
      this.collectibles.push({
        id: this.nextId++,
        type: 'modak',
        x: startX - 25,
        y: ground.y - 50,
        width: 34,
        height: 36,
        collected: false,
        bobOffset: 0.5,
        sparkleTimer: 0.2,
      });
      this.collectibles.push({
        id: this.nextId++,
        type: 'modak',
        x: startX + 85,
        y: ground.y - 50,
        width: 34,
        height: 36,
        collected: false,
        bobOffset: 1.0,
        sparkleTimer: 0.4,
      });
      this.lastSpawnX = startX + 130;
    }
  }

  public checkCollisions(playerBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Collectible[] {
    const gathered: Collectible[] = [];
    for (const item of this.collectibles) {
      if (item.collected) continue;

      const bobY = item.y + Math.sin(this.animTime * 4 + item.bobOffset) * 6;

      // Generous collection radius so jumping feels responsive and satisfying
      const expand = 14;
      const ix = item.x - expand;
      const iy = bobY - expand;
      const iw = item.width + expand * 2;
      const ih = item.height + expand * 2;

      if (
        playerBox.x < ix + iw &&
        playerBox.x + playerBox.width > ix &&
        playerBox.y < iy + ih &&
        playerBox.y + playerBox.height > iy
      ) {
        item.collected = true;
        gathered.push(item);
      }
    }
    return gathered;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const item of this.collectibles) {
      if (item.collected) continue;

      const bobY = item.y + Math.sin(this.animTime * 4.5 + item.bobOffset) * 6;
      ctx.save();
      ctx.translate(item.x + item.width * 0.5, bobY + item.height * 0.5);

      switch (item.type) {
        case 'modak': {
          // 1. Golden Aura Glow
          const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
          auraGrad.addColorStop(0, 'rgba(251, 191, 36, 0.5)');
          auraGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.18)');
          auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.fill();

          // 2. Sculpted Golden Modak Dumpling
          ctx.fillStyle = '#fbbf24'; // rich golden saffron
          ctx.beginPath();
          ctx.moveTo(0, -15); // sharp tip
          ctx.bezierCurveTo(9, -8, 16, 2, 14, 11);
          ctx.quadraticCurveTo(11, 15, 0, 15);
          ctx.quadraticCurveTo(-11, 15, -14, 11);
          ctx.bezierCurveTo(-16, 2, -9, -8, 0, -15);
          ctx.closePath();
          ctx.fill();

          // Modak pleats / folds
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(0, -14);
          ctx.lineTo(0, 14);
          ctx.moveTo(0, -14);
          ctx.quadraticCurveTo(7, 0, 7, 13);
          ctx.moveTo(0, -14);
          ctx.quadraticCurveTo(-7, 0, -7, 13);
          ctx.stroke();

          // Golden highlight
          ctx.fillStyle = '#fffbeb';
          ctx.beginPath();
          ctx.arc(-2, -6, 2.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'durva': {
          // Sacred Durva (Holy fresh green grass blades)
          const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 20);
          auraGrad.addColorStop(0, 'rgba(74, 222, 128, 0.45)');
          auraGrad.addColorStop(1, 'rgba(74, 222, 128, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fill();

          // 3 emerald blades tied together
          ctx.fillStyle = '#22c55e';
          ctx.strokeStyle = '#15803d';
          ctx.lineWidth = 1.2;

          // Center blade
          ctx.beginPath();
          ctx.ellipse(0, -4, 4, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Left blade
          ctx.beginPath();
          ctx.ellipse(-7, -2, 3.5, 12, -0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Right blade
          ctx.beginPath();
          ctx.ellipse(7, -2, 3.5, 12, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Sacred red tie (Moli thread)
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(-6, 4, 12, 4);
          break;
        }

        case 'flower': {
          // Vibrant Hibiscus / Lotus Festival Bloom
          const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
          auraGrad.addColorStop(0, 'rgba(244, 63, 94, 0.5)');
          auraGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();

          // 5 petals
          for (let p = 0; p < 5; p++) {
            const angle = (p / 5) * Math.PI * 2;
            ctx.save();
            ctx.rotate(angle);
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.ellipse(0, -9, 6, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            // Inner petal highlight
            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.ellipse(0, -7, 3.5, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Flower center with yellow pollen
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'diya': {
          // Sacred Brass Diya with Flickering Flame
          const auraGrad = ctx.createRadialGradient(0, -8, 2, 0, -8, 26);
          auraGrad.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
          auraGrad.addColorStop(0.6, 'rgba(239, 68, 68, 0.25)');
          auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, -8, 26, 0, Math.PI * 2);
          ctx.fill();

          // Clay / Brass lamp bowl
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.ellipse(0, 5, 14, 7, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Lamp beak
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.moveTo(8, 3);
          ctx.lineTo(16, 0);
          ctx.lineTo(12, 6);
          ctx.closePath();
          ctx.fill();

          // Sacred flickering flame
          const flicker = Math.sin(this.animTime * 18 + item.bobOffset) * 2;
          ctx.fillStyle = '#f97316'; // outer flame
          ctx.beginPath();
          ctx.moveTo(0, 3);
          ctx.quadraticCurveTo(7 + flicker, -4, 0, -16 + flicker);
          ctx.quadraticCurveTo(-7 + flicker, -4, 0, 3);
          ctx.fill();

          // Inner core flame (bright white-yellow)
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.moveTo(0, 2);
          ctx.quadraticCurveTo(3, -3, 0, -10 + flicker);
          ctx.quadraticCurveTo(-3, -3, 0, 2);
          ctx.fill();
          break;
        }
      }

      ctx.restore();
    }

    ctx.restore();
  }
}
