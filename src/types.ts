export type GameState = 
  | 'MENU'
  | 'TUTORIAL'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAME_OVER';

export type CollectibleType = 'modak' | 'durva' | 'flower' | 'diya';

export type ObstacleType = 
  | 'crate' 
  | 'stone' 
  | 'cart' 
  | 'pot' 
  | 'flower_hurdle' 
  | 'gap';

export type LocationTheme = 
  | 'festival_street' 
  | 'temple_town' 
  | 'riverside_ghat' 
  | 'grand_pandal';

export type CharacterSkin = 'classic' | 'royal' | 'golden' | 'cosmic';

export interface SkinInfo {
  id: CharacterSkin;
  name: string;
  subtitle: string;
  requiredModaks: number;
  primaryColor: string;
  accentColor: string;
  capeColor: string;
  unlocked: boolean;
}

export interface Collectible {
  id: number;
  type: CollectibleType;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  bobOffset: number;
  sparkleTimer: number;
}

export interface Obstacle {
  id: number;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  cleared: boolean;
  passed: boolean;
}

export interface TerrainPoint {
  x: number;
  y: number;
  isGap?: boolean;
}

export interface TerrainSegment {
  id: number;
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  isGap?: boolean;
  isPlatform?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'sparkle' | 'petal' | 'dust' | 'firework' | 'ring' | 'smoke';
  rotation?: number;
  rotationSpeed?: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  life: number;
  maxLife: number;
  scale: number;
}

export interface ScoreRecord {
  id: string;
  name: string;
  score: number;
  distance: number;
  modaks: number;
  date: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  reducedEffects: boolean;
  playerName: string;
  selectedSkin: CharacterSkin;
}

export interface GameStats {
  score: number;
  bestScore: number;
  distance: number;
  modaks: number;
  combo: number;
  comboMultiplier: number;
  festivalMeter: number;
  isMahotsav: boolean;
  mahotsavTimeLeft: number;
  hasShield: boolean;
  currentTheme: LocationTheme;
  jumpsRemaining: number;
  isNewBest?: boolean;
}
