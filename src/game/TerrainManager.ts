import { GAME_HEIGHT, GAME_WIDTH, PHYSICS } from './constants';

export interface TerrainPoint {
  x: number;
  y: number;
  isGap?: boolean;
}

export class TerrainManager {
  public baseGroundY: number = GAME_HEIGHT * PHYSICS.GROUND_Y_PERCENT;
  public gameWidth: number = GAME_WIDTH;
  private points: TerrainPoint[] = [];
  private currentX: number = 0;
  private currentY: number = this.baseGroundY;
  private minGroundY: number = GAME_HEIGHT * 0.58;
  private maxGroundY: number = GAME_HEIGHT * 0.82;
  private seedCounter: number = 0;

  constructor() {
    this.reset();
  }

  public setGameWidth(w: number): void {
    this.gameWidth = w;
    this.generateAhead(this.gameWidth * 2.5, 0);
  }

  public reset(): void {
    this.baseGroundY = GAME_HEIGHT * PHYSICS.GROUND_Y_PERCENT;
    this.currentX = 0;
    this.currentY = this.baseGroundY;
    this.seedCounter = 0;
    this.points = [];

    // Initial flat runway of 1200px to ensure smooth onboarding
    this.points.push({ x: -200, y: this.baseGroundY });
    this.points.push({ x: 0, y: this.baseGroundY });
    this.points.push({ x: 600, y: this.baseGroundY });
    this.points.push({ x: 1200, y: this.baseGroundY });
    this.currentX = 1200;

    // Generate upcoming segments ahead of the screen
    this.generateAhead(this.gameWidth * 2.5, 0);
  }

  public update(scrollSpeed: number, dt: number, distance: number): void {
    const shift = scrollSpeed * dt;

    // Shift all points left
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].x -= shift;
    }
    this.currentX -= shift;

    // Remove old points far behind screen
    while (this.points.length > 2 && this.points[1].x < -400) {
      this.points.shift();
    }

    // Keep generating new points ahead of right edge
    this.generateAhead(this.gameWidth * 2.5, distance);
  }

  private generateAhead(targetAheadX: number, distance: number): void {
    while (this.currentX < targetAheadX) {
      this.seedCounter++;
      const difficulty = Math.min(1.0, distance / 2200); // 0.0 to 1.0

      // Choose terrain pattern:
      // 0: Flat with slight variation
      // 1: Gentle uphill ramp
      // 2: Gentle downhill slope
      // 3: Elevated stepped platform
      // 4: Gap over festival water (only unlocked after 250m and spaced out)
      const roll = Math.random();

      if (roll < 0.4 - difficulty * 0.15) {
        // Flat segment
        const length = 280 + Math.random() * 220;
        this.currentX += length;
        this.points.push({ x: this.currentX, y: this.currentY });
      } else if (roll < 0.65) {
        // Gentle slope (up or down)
        const isUp = this.currentY > this.minGroundY + 60 && Math.random() < 0.55;
        const deltaH = isUp ? -(40 + Math.random() * 50) : (40 + Math.random() * 50);
        const length = 220 + Math.random() * 160;

        this.currentY = Math.max(this.minGroundY, Math.min(this.maxGroundY, this.currentY + deltaH));
        this.currentX += length;
        this.points.push({ x: this.currentX, y: this.currentY });
      } else if (roll < 0.85) {
        // Stepped terrace / platform
        const stepH = (Math.random() < 0.5 ? -1 : 1) * (35 + Math.random() * 35);
        const nextY = Math.max(this.minGroundY, Math.min(this.maxGroundY, this.currentY + stepH));
        
        // Step transition
        this.points.push({ x: this.currentX + 30, y: nextY });
        this.currentY = nextY;
        this.currentX += 300 + Math.random() * 200;
        this.points.push({ x: this.currentX, y: this.currentY });
      } else if (distance > 250 && Math.random() < 0.25 + difficulty * 0.2) {
        // Safe beatable Gap over illuminated water!
        // A gap width of 110-150px is easily cleared by single jump or double jump!
        const gapWidth = 110 + Math.random() * (40 + difficulty * 30);
        
        // Gap start marker
        this.points.push({ x: this.currentX, y: this.currentY, isGap: true });
        this.currentX += gapWidth;
        // Gap landing
        this.points.push({ x: this.currentX, y: this.currentY, isGap: false });

        // Safe landing flat buffer
        this.currentX += 320;
        this.points.push({ x: this.currentX, y: this.currentY });
      } else {
        // Standard pleasant road
        this.currentX += 260;
        this.points.push({ x: this.currentX, y: this.currentY });
      }
    }
  }

  /**
   * Get precise ground Y at any given X coordinate on the screen.
   * Returns null if point is over an active gap (falling into water!).
   */
  public getGroundAt(x: number): { y: number; isGap: boolean } {
    if (this.points.length === 0) return { y: this.baseGroundY, isGap: false };

    // If x is before first point
    if (x <= this.points[0].x) {
      return { y: this.points[0].y, isGap: !!this.points[0].isGap };
    }

    // Find segment enclosing x
    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];

      if (x >= p1.x && x <= p2.x) {
        // If p1 is a gap start, then the region between p1 and p2 is a gap!
        if (p1.isGap) {
          return { y: GAME_HEIGHT + 300, isGap: true };
        }

        const t = (x - p1.x) / (p2.x - p1.x);
        return { y: p1.y + (p2.y - p1.y) * t, isGap: false };
      }
    }

    // Beyond last point
    return { y: this.points[this.points.length - 1].y, isGap: false };
  }

  public render(ctx: CanvasRenderingContext2D, animTime: number): void {
    if (this.points.length < 2) return;

    ctx.save();

    // 1. Draw Sacred Festival Water in Background underneath the road
    const waterGrad = ctx.createLinearGradient(0, GAME_HEIGHT * 0.75, 0, GAME_HEIGHT);
    waterGrad.addColorStop(0, '#1e1b4b');
    waterGrad.addColorStop(0.5, '#1e293b');
    waterGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, GAME_HEIGHT * 0.75, this.gameWidth, GAME_HEIGHT * 0.25);

    // Floating water diyas with soft reflections under gaps
    const diyaCount = Math.max(6, Math.ceil(this.gameWidth / 180));
    for (let i = 0; i < diyaCount; i++) {
      const wx = ((i * 180 - animTime * 40) % (this.gameWidth + 200) + this.gameWidth + 200) % (this.gameWidth + 200) - 100;
      const wy = GAME_HEIGHT * 0.88 + Math.sin(animTime * 2 + i) * 6;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(wx, wy, 4, 0, Math.PI * 2);
      ctx.fill();
      // Reflection
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.fillRect(wx - 6, wy + 4, 12, 16);
    }

    // 2. Render each continuous ground segment
    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];

      // Skip rendering the road where there is a gap
      if (p1.isGap) {
        // Draw bridge support pillars on the left and right sides of the gap
        ctx.fillStyle = '#78350f';
        ctx.fillRect(p1.x - 12, p1.y, 16, GAME_HEIGHT - p1.y);
        ctx.fillRect(p2.x - 4, p2.y, 16, GAME_HEIGHT - p2.y);
        continue;
      }

      // Draw Main Road Polygon down to bottom of canvas
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p2.x, GAME_HEIGHT);
      ctx.lineTo(p1.x, GAME_HEIGHT);
      ctx.closePath();

      // Rich terracotta / temple sandstone road gradient
      const roadGrad = ctx.createLinearGradient(0, p1.y, 0, GAME_HEIGHT);
      roadGrad.addColorStop(0, '#9a3412'); // Rich warm terracotta
      roadGrad.addColorStop(0.08, '#7c2d12');
      roadGrad.addColorStop(0.3, '#431407');
      roadGrad.addColorStop(1, '#1c1917');
      ctx.fillStyle = roadGrad;
      ctx.fill();

      // Top Road Surface (Pavestone border)
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = '#f59e0b'; // Golden border
      ctx.lineWidth = 6;
      ctx.stroke();

      // Secondary decorative maroon line
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y + 7);
      ctx.lineTo(p2.x, p2.y + 7);
      ctx.strokeStyle = '#b91c1c'; // Kumkum red accent
      ctx.lineWidth = 4;
      ctx.stroke();

      // Stone brick lines along the road
      const segLength = p2.x - p1.x;
      const brickCount = Math.max(1, Math.floor(segLength / 45));
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      for (let b = 0; b <= brickCount; b++) {
        const bx = p1.x + (b / brickCount) * segLength;
        const by = p1.y + ((p2.y - p1.y) * b) / brickCount;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx - 10, by + 32);
        ctx.stroke();
      }

      // Rangoli flower motif along the pavement
      if (i % 2 === 0) {
        const midX = (p1.x + p2.x) * 0.5;
        const midY = (p1.y + p2.y) * 0.5 + 18;
        ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
        ctx.beginPath();
        ctx.arc(midX, midY, 6, 0, Math.PI * 2);
        ctx.fill();
        for (let petal = 0; petal < 6; petal++) {
          const ang = (petal / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(midX + Math.cos(ang) * 9, midY + Math.sin(ang) * 9, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }
}
