import { CharacterSkin } from '../types';
import { PHYSICS, SKINS } from './constants';
import { ParticleSystem } from './ParticleSystem';

export class Player {
  public x: number;
  public y: number;
  public width: number = 72;
  public height: number = 76;
  public vy: number = 0;
  public isGrounded: boolean = false;
  public jumpsRemaining: number = 3;
  public jumpCountUsed: number = 0;
  
  // Animation states
  public animTime: number = 0;
  public squashScaleX: number = 1;
  public squashScaleY: number = 1;
  public rotation: number = 0;
  public isDead: boolean = false;
  public deadTimer: number = 0;
  public skin: CharacterSkin = 'classic';
  public hasShield: boolean = false;
  public isMahotsav: boolean = false;

  // Trail history for high-speed effect
  private trail: { x: number; y: number; alpha: number; scaleX: number; scaleY: number }[] = [];

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
  }

  public reset(startX: number, startY: number, skin: CharacterSkin = 'classic'): void {
    this.x = startX;
    this.y = startY;
    this.vy = 0;
    this.isGrounded = false;
    this.jumpsRemaining = 3;
    this.jumpCountUsed = 0;
    this.animTime = 0;
    this.squashScaleX = 1;
    this.squashScaleY = 1;
    this.rotation = 0;
    this.isDead = false;
    this.deadTimer = 0;
    this.skin = skin;
    this.hasShield = false;
    this.isMahotsav = false;
    this.trail = [];
  }

  public jump(particles: ParticleSystem): boolean {
    if (this.isDead) return false;
    if (this.jumpsRemaining <= 0) return false;

    this.jumpCountUsed++;
    const jumpIdx = this.jumpCountUsed; // 1, 2, or 3
    this.jumpsRemaining--;
    this.isGrounded = false;

    if (jumpIdx === 1) {
      this.vy = PHYSICS.JUMP_FORCE_1;
      // Stretch on jump
      this.squashScaleX = 0.82;
      this.squashScaleY = 1.25;
      particles.emitLandingDust(this.x + this.width * 0.5, this.y + this.height);
    } else if (jumpIdx === 2) {
      this.vy = PHYSICS.JUMP_FORCE_2;
      this.squashScaleX = 0.78;
      this.squashScaleY = 1.3;
      particles.emitJumpEffect(this.x + this.width * 0.5, this.y + this.height * 0.7, 2);
    } else {
      // Triple jump
      this.vy = PHYSICS.JUMP_FORCE_3;
      this.squashScaleX = 0.72;
      this.squashScaleY = 1.35;
      particles.emitJumpEffect(this.x + this.width * 0.5, this.y + this.height * 0.7, 3);
    }

    return true;
  }

  public update(dt: number, groundY: number, particles: ParticleSystem): void {
    this.animTime += dt;

    // Recover squash & stretch smoothly towards 1.0
    this.squashScaleX += (1 - this.squashScaleX) * Math.min(1, dt * 10);
    this.squashScaleY += (1 - this.squashScaleY) * Math.min(1, dt * 10);

    if (this.isDead) {
      this.deadTimer += dt;
      // Gentle bump backwards & fall
      this.vy += PHYSICS.GRAVITY * dt;
      this.y += this.vy * dt;
      this.rotation += dt * 3;
      return;
    }

    // Apply gravity
    this.vy += PHYSICS.GRAVITY * dt;
    if (this.vy > PHYSICS.MAX_FALL_SPEED) {
      this.vy = PHYSICS.MAX_FALL_SPEED;
    }

    this.y += this.vy * dt;

    // Check ground collision
    const targetFootY = groundY;
    if (this.y + this.height >= targetFootY) {
      // Just landed!
      if (!this.isGrounded) {
        this.isGrounded = true;
        this.jumpsRemaining = 3;
        this.jumpCountUsed = 0;
        // Landing squash
        this.squashScaleX = 1.25;
        this.squashScaleY = 0.75;
        particles.emitLandingDust(this.x + this.width * 0.5, targetFootY);
      }
      this.y = targetFootY - this.height;
      this.vy = 0;
      this.rotation = 0;
    } else {
      this.isGrounded = false;
      // Mid-air pitch rotation according to vertical velocity
      this.rotation = Math.max(-0.25, Math.min(0.35, this.vy / 1200));
    }

    // High speed or Mahotsav trail
    if (this.isMahotsav || Math.abs(this.vy) > 300) {
      this.trail.push({
        x: this.x,
        y: this.y,
        alpha: 0.5,
        scaleX: this.squashScaleX,
        scaleY: this.squashScaleY,
      });
      if (this.trail.length > 5) {
        this.trail.shift();
      }
    } else if (this.trail.length > 0) {
      this.trail.shift();
    }

    // Update trail alpha
    for (const t of this.trail) {
      t.alpha -= dt * 3;
    }
  }

  public getHitbox(): { x: number; y: number; width: number; height: number } {
    // Generous forgiving hitbox for player
    const insetX = 14;
    const insetY = 12;
    return {
      x: this.x + insetX,
      y: this.y + insetY,
      width: this.width - insetX * 2,
      height: this.height - insetY * 2,
    };
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const skinInfo = SKINS[this.skin] || SKINS.classic;

    // Render motion trail
    for (const t of this.trail) {
      if (t.alpha <= 0) continue;
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.alpha * 0.4);
      ctx.translate(t.x + this.width * 0.5, t.y + this.height * 0.5);
      ctx.scale(t.scaleX * 0.95, t.scaleY * 0.95);
      ctx.fillStyle = this.isMahotsav ? '#f59e0b' : skinInfo.accentColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(this.x + this.width * 0.5, this.y + this.height * 0.5);
    ctx.rotate(this.rotation);
    ctx.scale(this.squashScaleX, this.squashScaleY);

    // Glowing aura if Mahotsav Mode or Cosmic Skin
    if (this.isMahotsav) {
      ctx.save();
      const auraPulse = Math.sin(this.animTime * 12) * 5 + 35;
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, auraPulse);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.2)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, auraPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Shield Aura if active
    if (this.hasShield) {
      ctx.save();
      const shieldPulse = Math.sin(this.animTime * 8) * 3 + 42;
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, shieldPulse, 0, Math.PI * 2);
      ctx.stroke();

      // Mini rotating lotus petals on shield
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + this.animTime * 3;
        const px = Math.cos(angle) * shieldPulse;
        const py = Math.sin(angle) * shieldPulse;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Run cycle parameters
    const runCycle = this.isGrounded ? Math.sin(this.animTime * 18) : 0;
    const footCycle = this.isGrounded ? Math.cos(this.animTime * 18) : 0;
    const bodyBob = this.isGrounded ? Math.abs(runCycle) * 4 : 0;

    // 1. Cute Long Expressive Mouse Tail
    ctx.save();
    ctx.strokeStyle = '#d4b395';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-18, 10 + bodyBob);
    const tailWag = Math.sin(this.animTime * 14) * 8;
    ctx.bezierCurveTo(
      -32, 16 + tailWag,
      -38, -4 + tailWag * 1.4,
      -46, -12 + (this.isGrounded ? tailWag : -8)
    );
    ctx.stroke();
    ctx.restore();

    // 2. Back Feet (Feet in run motion)
    ctx.save();
    ctx.fillStyle = '#c79c78';
    // Left foot
    const leftFootX = -12 - footCycle * 10;
    const leftFootY = 24 + runCycle * 6;
    ctx.beginPath();
    ctx.ellipse(leftFootX, leftFootY, 9, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Right foot
    const rightFootX = 8 + footCycle * 10;
    const rightFootY = 24 - runCycle * 6;
    ctx.beginPath();
    ctx.ellipse(rightFootX, rightFootY, 9, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Modak Sack / Festive Pouch slung on back
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(-14, -2 + bodyBob, 12, 15, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Golden drawstring knot
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-14, -15 + bodyBob, 4, 0, Math.PI * 2);
    ctx.fill();
    // Glowing golden modak peeking out
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(-14, -17 + bodyBob, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Festive Shawl / Cape fluttering in wind
    ctx.save();
    ctx.fillStyle = skinInfo.capeColor;
    ctx.beginPath();
    ctx.moveTo(-8, -4 + bodyBob);
    const capeFlutter = Math.sin(this.animTime * 20) * 6;
    ctx.lineTo(-28, -2 + capeFlutter);
    ctx.lineTo(-30, 16 + capeFlutter * 0.8);
    ctx.lineTo(-8, 14 + bodyBob);
    ctx.closePath();
    ctx.fill();
    // Gold zari border on shawl
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 5. Main Chubby Mouse Body
    ctx.save();
    ctx.fillStyle = skinInfo.primaryColor;
    ctx.strokeStyle = '#b8906f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 4 + bodyBob, 20, 22, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cute belly (cream patch)
    ctx.fillStyle = '#fff7ed';
    ctx.beginPath();
    ctx.ellipse(6, 6 + bodyBob, 12, 15, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Traditional red/gold waist band (dhoti belt)
    ctx.fillStyle = skinInfo.accentColor;
    ctx.beginPath();
    ctx.rect(-10, 14 + bodyBob, 20, 4);
    ctx.fill();
    // Little golden waist bell
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 18 + bodyBob, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Cute Head & Festive Expression
    ctx.save();
    const headX = 10;
    const headY = -12 + bodyBob;

    // Fur head base
    ctx.fillStyle = skinInfo.primaryColor;
    ctx.strokeStyle = '#b8906f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(headX, headY, 18, 17, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ears (Large charming mouse ears)
    // Left / Back Ear
    ctx.save();
    ctx.fillStyle = skinInfo.primaryColor;
    ctx.beginPath();
    ctx.ellipse(headX - 12, headY - 14, 12, 14, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbcfe8'; // inner pink
    ctx.beginPath();
    ctx.ellipse(headX - 12, headY - 14, 7, 9, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right / Front Ear
    ctx.save();
    ctx.fillStyle = skinInfo.primaryColor;
    ctx.beginPath();
    ctx.ellipse(headX + 4, headY - 16, 12, 14, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbcfe8'; // inner pink
    ctx.beginPath();
    ctx.ellipse(headX + 4, headY - 16, 7, 9, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cute Snout / Nose
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.ellipse(headX + 16, headY + 3, 9, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Little pink nose tip
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.ellipse(headX + 22, headY + 2, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Whiskers!
    ctx.strokeStyle = 'rgba(100, 80, 60, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(headX + 18, headY + 1);
    ctx.lineTo(headX + 32, headY - 3);
    ctx.moveTo(headX + 18, headY + 3);
    ctx.lineTo(headX + 33, headY + 4);
    ctx.moveTo(headX + 18, headY + 5);
    ctx.lineTo(headX + 31, headY + 10);
    ctx.stroke();

    // Big expressive sparkling eyes
    ctx.fillStyle = '#1e1b4b'; // dark indigo
    ctx.beginPath();
    ctx.ellipse(headX + 9, headY - 3, 6, 7, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine highlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(headX + 7.5, headY - 5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headX + 11, headY - 1.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Joyful curved smile
    ctx.strokeStyle = '#831843';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(headX + 15, headY + 6, 5, 0.2, Math.PI * 0.85);
    ctx.stroke();

    // Sacred Tilak / Chandan on forehead
    ctx.fillStyle = '#dc2626'; // Kumkum red
    ctx.beginPath();
    ctx.ellipse(headX + 5, headY - 8, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbbf24'; // Golden dot
    ctx.beginPath();
    ctx.arc(headX + 5, headY - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // end head

    // 7. Little Hands holding a tiny golden modak
    ctx.save();
    ctx.fillStyle = skinInfo.primaryColor;
    ctx.beginPath();
    ctx.ellipse(14, 6 + bodyBob, 6, 4, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Little golden modak in hands
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(18, 2 + bodyBob);
    ctx.quadraticCurveTo(22, 9 + bodyBob, 14, 9 + bodyBob);
    ctx.quadraticCurveTo(14, 2 + bodyBob, 18, 2 + bodyBob);
    ctx.fill();
    ctx.restore();

    ctx.restore(); // end character
  }
}
