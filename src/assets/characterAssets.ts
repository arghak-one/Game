import festivalBgImg from './images/festival_bg_1789401241227.jpg';
import mushakHeroImg from './images/mushak_hero_1789401265621.jpg';
import mushakRoyalImg from './images/mushak_royal_1789401284967.jpg';
import mushakGoldenImg from './images/mushak_golden_1789401307256.jpg';
import mushakCosmicImg from './images/mushak_cosmic_1789401329639.jpg';
import mushakRestingImg from './images/mushak_resting_1789408681650.jpg';
import { CharacterSkin } from '../types';

export const FESTIVAL_BG_IMAGE = festivalBgImg;
export const MUSHAK_RESTING_IMAGE = mushakRestingImg;

export const SKIN_IMAGES: Record<CharacterSkin, string> = {
  classic: mushakHeroImg,
  royal: mushakRoyalImg,
  golden: mushakGoldenImg,
  cosmic: mushakCosmicImg,
};
