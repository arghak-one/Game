import { FloatingText, Particle } from '../types';

export class ParticleSystem {
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private nextTextId: number = 1;

  public reset(): void {
    this.particles = [];
    this.floatingTexts = [];
  }

  public emitPetals(x: number, y: number, count: number = 3): void {
    const colors = ['#f43f5e', '#fb923c', '#f59e0b', '#ec4899', '#fde047'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 40 - 20),
        y: y + (Math.random() * 40 - 20),
        vx: -80 - Math.random() * 120,
        vy: 20 + Math.random() * 60,
        life: 1.0,
        maxLife: 1.2 + Math.random() * 0.8,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'petal',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 4,
      });
    }
  }

  public emitCollectBurst(x: number, y: number, color: string, count: number = 14): void {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 120 + Math.random() * 220;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        life: 1.0,
        maxLife: 0.5 + Math.random() * 0.4,
        size: 4 + Math.random() * 5,
        color,
        type: 'sparkle',
      });
    }

    // Expanding ring
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 1.0,
      maxLife: 0.35,
      size: 10,
      color,
      type: 'ring',
    });
  }

  public emitJumpEffect(x: number, y: number, level: number): void {
    const ringColor = level === 3 ? '#a855f7' : level === 2 ? '#38bdf8' : '#f59e0b';
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 1.0,
      maxLife: 0.38,
      size: level * 14,
      color: ringColor,
      type: 'ring',
    });

    // Golden sparks
    for (let i = 0; i < level * 4; i++) {
      this.particles.push({
        x: x + (Math.random() * 20 - 10),
        y: y + (Math.random() * 10 - 5),
        vx: -60 - Math.random() * 100,
        vy: 40 + Math.random() * 100,
        life: 1.0,
        maxLife: 0.4 + Math.random() * 0.3,
        size: 3 + Math.random() * 4,
        color: ringColor,
        type: 'sparkle',
      });
    }
  }

  public emitLandingDust(x: number, y: number): void {
    for (let i = 0; i < 7; i++) {
      const dir = i % 2 === 0 ? 1 : -1;
      this.particles.push({
        x: x + dir * (5 + Math.random() * 15),
        y: y - 2,
        vx: dir * (40 + Math.random() * 70),
        vy: -15 - Math.random() * 30,
        life: 1.0,
        maxLife: 0.4 + Math.random() * 0.2,
        size: 5 + Math.random() * 6,
        color: 'rgba(230, 200, 160, 0.65)',
        type: 'dust',
      });
    }
  }

  public emitMahotsavCelebration(width: number, height: number): void {
    const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#38bdf8', '#fbbf24'];
    for (let i = 0; i < 4; i++) {
      const rx = Math.random() * width;
      const ry = 100 + Math.random() * (height * 0.5);
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      for (let j = 0; j < 12; j++) {
        const angle = (j / 12) * Math.PI * 2;
        const spd = 60 + Math.random() * 120;
        this.particles.push({
          x: rx,
          y: ry,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 1.0,
          maxLife: 0.7 + Math.random() * 0.4,
          size: 3 + Math.random() * 4,
          color,
          type: 'firework',
        });
      }
    }
  }

  public addFloatingText(text: string, x: number, y: number, color: string = '#fbbf24'): void {
    this.floatingTexts.push({
      id: this.nextTextId++,
      text,
      x,
      y,
      color,
      life: 1.0,
      maxLife: 0.85,
      scale: 1.3,
    });
  }

  public update(dt: number): void {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt / p.maxLife;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.type === 'petal') {
        p.rotation = (p.rotation || 0) + (p.rotationSpeed || 1) * dt;
        p.vx += Math.sin(p.life * 6) * 10 * dt;
      } else if (p.type === 'sparkle' || p.type === 'firework') {
        p.vy += 220 * dt; // slight gravity
      } else if (p.type === 'dust') {
        p.size *= 1 + dt * 0.5;
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt / ft.maxLife;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      ft.y -= 70 * dt;
      ft.scale = 1 + (1 - ft.life) * 0.2;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const p of this.particles) {
      const alpha = Math.max(0, Math.min(1, p.life));
      ctx.globalAlpha = alpha;

      if (p.type === 'ring') {
        const radius = (1 - p.life) * p.size * 2.5 + 8;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1, p.life * 4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'petal') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'dust') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sparkle / firework
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render floating texts
    for (const ft of this.floatingTexts) {
      const alpha = Math.max(0, Math.min(1, ft.life));
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(ft.x, ft.y);
      ctx.scale(ft.scale, ft.scale);
      ctx.font = 'bold 24px "Yatra One", "Poppins", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Outer glow / shadow
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, 0, 0);

      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, 0, 0);
      ctx.restore();
    }

    ctx.restore();
  }
}
