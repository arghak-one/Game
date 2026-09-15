import { LocationTheme } from '../types';
import { GAME_HEIGHT, GAME_WIDTH } from './constants';

export class BackgroundRenderer {
  public gameWidth: number = GAME_WIDTH;
  private skyStars: { x: number; y: number; size: number; alpha: number; pulseSpeed: number }[] = [];
  private lanterns: { x: number; y: number; size: number; speed: number; swing: number }[] = [];

  constructor() {
    this.initElements();
  }

  public setGameWidth(w: number): void {
    if (this.gameWidth === w) return;
    this.gameWidth = w;
    this.initElements();
  }

  private initElements(): void {
    this.skyStars = [];
    const starCount = Math.max(45, Math.ceil((this.gameWidth / 900) * 45));
    for (let i = 0; i < starCount; i++) {
      this.skyStars.push({
        x: Math.random() * this.gameWidth,
        y: Math.random() * (GAME_HEIGHT * 0.45),
        size: 1 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.7,
        pulseSpeed: 1 + Math.random() * 3,
      });
    }

    this.lanterns = [];
    const lanternCount = Math.max(12, Math.ceil((this.gameWidth / 900) * 12));
    for (let i = 0; i < lanternCount; i++) {
      this.lanterns.push({
        x: Math.random() * this.gameWidth,
        y: 80 + Math.random() * (GAME_HEIGHT * 0.35),
        size: 14 + Math.random() * 12,
        speed: 15 + Math.random() * 20,
        swing: Math.random() * Math.PI * 2,
      });
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    cameraX: number,
    animTime: number,
    theme: LocationTheme,
    isMahotsav: boolean
  ): void {
    ctx.save();

    // 1. SKY GRADIENT
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT * 0.75);
    if (isMahotsav) {
      // Golden celebratory sky during Mahotsav Mode!
      skyGrad.addColorStop(0, '#2e1065'); // Royal cosmic violet
      skyGrad.addColorStop(0.35, '#581c87');
      skyGrad.addColorStop(0.7, '#9a3412');
      skyGrad.addColorStop(1, '#f59e0b'); // Radiant gold horizon
    } else if (theme === 'temple_town') {
      skyGrad.addColorStop(0, '#172554'); // Deep night blue
      skyGrad.addColorStop(0.4, '#1e1b4b');
      skyGrad.addColorStop(0.75, '#4c1d95');
      skyGrad.addColorStop(1, '#ea580c'); // Saffron sunset
    } else if (theme === 'riverside_ghat') {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.45, '#1e293b');
      skyGrad.addColorStop(0.8, '#3b0764');
      skyGrad.addColorStop(1, '#be185d'); // Pink twilight horizon
    } else if (theme === 'grand_pandal') {
      skyGrad.addColorStop(0, '#3b0764');
      skyGrad.addColorStop(0.4, '#701a75');
      skyGrad.addColorStop(0.75, '#831843');
      skyGrad.addColorStop(1, '#d97706');
    } else {
      // Festival Street (Default twilight)
      skyGrad.addColorStop(0, '#180e29'); // Deep indigo
      skyGrad.addColorStop(0.4, '#311042');
      skyGrad.addColorStop(0.75, '#581335');
      skyGrad.addColorStop(1, '#c2410c'); // Warm saffron dusk
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.gameWidth, GAME_HEIGHT);

    // 2. CELESTIAL MOON
    ctx.save();
    const moonX = this.gameWidth * 0.82;
    const moonY = GAME_HEIGHT * 0.14;
    // Moon halo
    const moonHalo = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 70);
    moonHalo.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
    moonHalo.addColorStop(0.5, 'rgba(251, 191, 36, 0.15)');
    moonHalo.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = moonHalo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 70, 0, Math.PI * 2);
    ctx.fill();
    // Moon disc
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. TWINKLING STARS
    ctx.fillStyle = '#ffffff';
    for (const star of this.skyStars) {
      const pulse = Math.sin(animTime * star.pulseSpeed) * 0.3 + 0.7;
      ctx.globalAlpha = star.alpha * pulse;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 4. FLOATING FESTIVAL SKY LANTERNS (KANDILS)
    for (const k of this.lanterns) {
      const kx = ((k.x - cameraX * 0.05) % (this.gameWidth + 100) + this.gameWidth + 100) % (this.gameWidth + 100) - 50;
      const ky = k.y + Math.sin(animTime * 1.5 + k.swing) * 8;
      // Lantern glow
      const lGrad = ctx.createRadialGradient(kx, ky, 2, kx, ky, k.size * 1.8);
      lGrad.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
      lGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.3)');
      lGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = lGrad;
      ctx.beginPath();
      ctx.arc(kx, ky, k.size * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Octagonal lantern body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(kx, ky, k.size * 0.5, k.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tassels hanging down
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(kx - 4, ky + k.size * 0.7);
      ctx.lineTo(kx - 6, ky + k.size * 1.2);
      ctx.moveTo(kx, ky + k.size * 0.7);
      ctx.lineTo(kx, ky + k.size * 1.3);
      ctx.moveTo(kx + 4, ky + k.size * 0.7);
      ctx.lineTo(kx + 6, ky + k.size * 1.2);
      ctx.stroke();
    }

    // 5. LAYER 1: FAR SILHOUETTE WITH RESPECTFUL SACRED GANESHA PANDAL (Parallax factor 0.08)
    this.renderFarPandalSilhouette(ctx, cameraX * 0.08, animTime, isMahotsav);

    // 6. LAYER 2: MIDGROUND FESTIVAL BUILDINGS & ORNATE ARCHES (Parallax factor 0.22)
    this.renderMidgroundBuildings(ctx, cameraX * 0.22, animTime, theme);

    // 7. LAYER 3: HANGING MARIGOLD GARLANDS & FESTIVAL STREET LAMPS (Parallax factor 0.45)
    this.renderStreetGarlands(ctx, cameraX * 0.45, animTime);

    ctx.restore();
  }

  private renderFarPandalSilhouette(
    ctx: CanvasRenderingContext2D,
    offset: number,
    animTime: number,
    isMahotsav: boolean
  ): void {
    ctx.save();
    const groundBase = GAME_HEIGHT * 0.74;

    // Distant Grand Temple Shikhar / Pandal repeated every 800px
    const patternWidth = 850;
    const startIdx = Math.floor(offset / patternWidth);
    const count = Math.ceil(this.gameWidth / patternWidth) + 1;

    for (let i = startIdx - 1; i <= startIdx + count; i++) {
      const baseX = i * patternWidth - offset;

      // Glowing Sacred Golden Halo behind the Lord Ganesha Silhouette in the distant pandal
      const haloX = baseX + 420;
      const haloY = groundBase - 240;
      const haloRad = isMahotsav ? 160 : 130;
      const auraPulse = Math.sin(animTime * 2 + i) * 10;

      const ganeshaHalo = ctx.createRadialGradient(haloX, haloY, 20, haloX, haloY, haloRad + auraPulse);
      ganeshaHalo.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
      ganeshaHalo.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
      ganeshaHalo.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = ganeshaHalo;
      ctx.beginPath();
      ctx.arc(haloX, haloY, haloRad + auraPulse, 0, Math.PI * 2);
      ctx.fill();

      // Respectful Distant Ganesha Idol Silhouette atop the sacred lotus dais
      ctx.fillStyle = 'rgba(40, 15, 60, 0.75)'; // Soft respectful twilight silhouette
      
      // Majestic Temple Mandap Arch
      ctx.beginPath();
      ctx.moveTo(baseX + 260, groundBase);
      ctx.lineTo(baseX + 260, groundBase - 260);
      ctx.quadraticCurveTo(haloX, groundBase - 360, baseX + 580, groundBase - 260);
      ctx.lineTo(baseX + 580, groundBase);
      ctx.closePath();
      ctx.fill();

      // Sacred Ganesha peaceful blessing silhouette inside the mandap:
      // Crown (Mukut)
      ctx.beginPath();
      ctx.moveTo(haloX, haloY - 95);
      ctx.lineTo(haloX + 22, haloY - 60);
      ctx.lineTo(haloX - 22, haloY - 60);
      ctx.closePath();
      ctx.fill();

      // Divine Head with large compassionate ears
      ctx.beginPath();
      ctx.arc(haloX, haloY - 45, 26, 0, Math.PI * 2); // Head
      ctx.ellipse(haloX - 35, haloY - 45, 16, 20, -0.2, 0, Math.PI * 2); // Left ear
      ctx.ellipse(haloX + 35, haloY - 45, 16, 20, 0.2, 0, Math.PI * 2); // Right ear
      ctx.fill();

      // Sacred graceful Trunk (Vakratunda) curving left towards the bowl of modaks
      ctx.lineWidth = 9;
      ctx.strokeStyle = 'rgba(40, 15, 60, 0.75)';
      ctx.beginPath();
      ctx.moveTo(haloX, haloY - 35);
      ctx.quadraticCurveTo(haloX - 10, haloY - 15, haloX - 24, haloY - 18);
      ctx.quadraticCurveTo(haloX - 30, haloY - 26, haloX - 22, haloY - 30);
      ctx.stroke();

      // Peaceful blessing body seated on lotus throne
      ctx.beginPath();
      ctx.ellipse(haloX, haloY + 15, 48, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lotus throne petals
      ctx.fillStyle = 'rgba(236, 72, 153, 0.35)'; // soft pink glow on lotus petals
      for (let p = -3; p <= 3; p++) {
        ctx.beginPath();
        ctx.ellipse(haloX + p * 20, groundBase - 15, 16, 24, p * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Temple Towers (Shikhars) on left and right
      ctx.fillStyle = 'rgba(30, 10, 50, 0.65)';
      ctx.beginPath();
      ctx.moveTo(baseX + 40, groundBase);
      ctx.lineTo(baseX + 80, groundBase - 220);
      ctx.lineTo(baseX + 120, groundBase);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(baseX + 720, groundBase);
      ctx.lineTo(baseX + 760, groundBase - 200);
      ctx.lineTo(baseX + 800, groundBase);
      ctx.fill();
    }

    ctx.restore();
  }

  private renderMidgroundBuildings(
    ctx: CanvasRenderingContext2D,
    offset: number,
    animTime: number,
    theme: LocationTheme
  ): void {
    ctx.save();
    const groundBase = GAME_HEIGHT * 0.75;
    const bWidth = 420;
    const startIdx = Math.floor(offset / bWidth);
    const count = Math.ceil(this.gameWidth / bWidth) + 2;

    for (let i = startIdx - 1; i <= startIdx + count; i++) {
      const bx = i * bWidth - offset;

      // Ornate Rajasthani / Maratha Haveli Building facade
      ctx.fillStyle = '#3c1840';
      ctx.fillRect(bx, groundBase - 180, 240, 180);

      // Jharokha (ornate balcony) on building
      ctx.fillStyle = '#581c87';
      ctx.beginPath();
      ctx.roundRect(bx + 40, groundBase - 140, 60, 70, 8);
      ctx.fill();

      // Glowing warm festival window light
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(bx + 70, groundBase - 110, 18, 0, Math.PI * 2);
      ctx.fill();

      // Temple chhatri (dome) atop building
      ctx.fillStyle = '#6b21a8';
      ctx.beginPath();
      ctx.arc(bx + 120, groundBase - 180, 45, Math.PI, 0);
      ctx.fill();
      // Kalash pinnacle on dome
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(bx + 118, groundBase - 235, 4, 15);
      ctx.beginPath();
      ctx.arc(bx + 120, groundBase - 238, 4, 0, Math.PI * 2);
      ctx.fill();

      // Sacred Archway inscribed with "श्री गणेशाय नमः"
      if (i % 2 === 0) {
        const archX = bx + 260;
        ctx.fillStyle = '#4a154b';
        ctx.fillRect(archX, groundBase - 230, 20, 230);
        ctx.fillRect(archX + 130, groundBase - 230, 20, 230);
        // Curved top arch
        ctx.beginPath();
        ctx.arc(archX + 75, groundBase - 230, 75, Math.PI, 0);
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#d97706';
        ctx.stroke();

        // Glowing Arch Banner
        ctx.fillStyle = '#991b1b'; // Maroon red banner
        ctx.fillRect(archX + 10, groundBase - 275, 130, 32);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(archX + 10, groundBase - 275, 130, 32);

        // Devanagari holy blessing text
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 15px "Yatra One", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('श्री गणेशाय नमः', archX + 75, groundBase - 258);
      }
    }

    ctx.restore();
  }

  private renderStreetGarlands(
    ctx: CanvasRenderingContext2D,
    offset: number,
    animTime: number
  ): void {
    ctx.save();
    const garlandSpan = 280;
    const startIdx = Math.floor(offset / garlandSpan);
    const count = Math.ceil(this.gameWidth / garlandSpan) + 2;

    for (let i = startIdx - 1; i <= startIdx + count; i++) {
      const gx1 = i * garlandSpan - offset;
      const gx2 = gx1 + garlandSpan;
      const gy = GAME_HEIGHT * 0.46;

      // Swaying Marigold & Mango Leaf Toran (Garland)
      const sag = 45 + Math.sin(animTime * 2 + i) * 4;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gx1, gy);
      ctx.quadraticCurveTo((gx1 + gx2) * 0.5, gy + sag, gx2, gy);
      ctx.stroke();

      // Hanging orange/yellow marigold pom-poms along garland
      const flowerCount = 9;
      for (let f = 0; f <= flowerCount; f++) {
        const t = f / flowerCount;
        const fx = gx1 + (gx2 - gx1) * t;
        const fy = gy + 4 * sag * t * (1 - t);
        ctx.fillStyle = f % 2 === 0 ? '#f59e0b' : '#ef4444';
        ctx.beginPath();
        ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hanging Brass Festival Lamp with flickering flame
      const lampX = (gx1 + gx2) * 0.5;
      const lampY = gy + sag + 18;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lampX, gy + sag);
      ctx.lineTo(lampX, lampY);
      ctx.stroke();

      // Glowing Lamp Light
      const glow = ctx.createRadialGradient(lampX, lampY + 10, 2, lampX, lampY + 10, 24);
      glow.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
      glow.addColorStop(0.6, 'rgba(245, 158, 11, 0.25)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lampX, lampY + 10, 24, 0, Math.PI * 2);
      ctx.fill();

      // Brass Diya body
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(lampX, lampY + 12, 10, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flame
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(lampX, lampY + 7, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
