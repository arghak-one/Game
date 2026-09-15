import { CharacterSkin, LocationTheme, SkinInfo } from '../types';

export const GAME_WIDTH = 900;
export const GAME_HEIGHT = 1600;

export const PHYSICS = {
  GRAVITY: 1750, // px / s^2
  JUMP_FORCE_1: -660,
  JUMP_FORCE_2: -600,
  JUMP_FORCE_3: -540,
  MAX_FALL_SPEED: 1100,
  GROUND_Y_PERCENT: 0.76, // Ground level is ~76% down the screen
  PLAYER_X_PERCENT: 0.26, // Mushak position ~26% from left
  BASE_SPEED: 390,
  MAX_SPEED: 760,
  SPEED_INCREASE_RATE: 2.2, // px/s added per 100m
  MAHOTSAV_SPEED_MULT: 1.15,
};

export const VALUES = {
  MODAK_POINTS: 10,
  MODAK_METER_GAIN: 3,
  DURVA_POINTS: 20,
  DURVA_METER_GAIN: 6,
  FLOWER_POINTS: 15,
  FLOWER_METER_GAIN: 15,
  DIYA_POINTS: 30,
  DIYA_METER_GAIN: 10,
  DISTANCE_POINT_INTERVAL: 2, // 1 point every 2m
  MAHOTSAV_DURATION: 12, // seconds
  MAHOTSAV_SCORE_MULT: 2,
  COMBO_TIMEOUT: 4.2, // seconds
};

export const SKINS: Record<CharacterSkin, SkinInfo> = {
  classic: {
    id: 'classic',
    name: 'Festive Mushak',
    subtitle: 'Lord Ganesha\'s Beloved Companion',
    requiredModaks: 0,
    primaryColor: '#e0c7a8',
    accentColor: '#d97706',
    capeColor: '#dc2626',
    unlocked: true,
  },
  royal: {
    id: 'royal',
    name: 'Rajvanshi Mushak',
    subtitle: 'Adorned in Silk & Golden Zari',
    requiredModaks: 50,
    primaryColor: '#fef08a',
    accentColor: '#7c3aed',
    capeColor: '#b91c1c',
    unlocked: false,
  },
  golden: {
    id: 'golden',
    name: 'Swarna Mushak',
    subtitle: 'Blessed with Radiant Golden Aura',
    requiredModaks: 150,
    primaryColor: '#fef08a',
    accentColor: '#f59e0b',
    capeColor: '#d97706',
    unlocked: false,
  },
  cosmic: {
    id: 'cosmic',
    name: 'Divya Mushak',
    subtitle: 'Shining with Celestial Stars',
    requiredModaks: 300,
    primaryColor: '#c4b5fd',
    accentColor: '#06b6d4',
    capeColor: '#4f46e5',
    unlocked: false,
  },
};

export const THEME_THRESHOLDS: { distance: number; theme: LocationTheme; title: string }[] = [
  { distance: 0, theme: 'festival_street', title: 'Festival Street' },
  { distance: 600, theme: 'temple_town', title: 'Temple Town' },
  { distance: 1500, theme: 'riverside_ghat', title: 'Riverside Ghat' },
  { distance: 2600, theme: 'grand_pandal', title: 'Grand Pandal' },
];
