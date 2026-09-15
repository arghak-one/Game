import { useEffect, useState } from 'react';

export interface DeviceOrientationInfo {
  isLandscape: boolean;
  isMobile: boolean;
  isMobileLandscape: boolean;
  isMobilePortrait: boolean;
  screenWidth: number;
  screenHeight: number;
}

function checkIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isSmallScreen = Math.min(window.screen?.width || window.innerWidth, window.screen?.height || window.innerHeight) <= 850;

  return Boolean(hasTouch && (isCoarse || isMobileUA || isSmallScreen));
}

export function useDeviceOrientation(): DeviceOrientationInfo {
  const [info, setInfo] = useState<DeviceOrientationInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isLandscape: false,
        isMobile: false,
        isMobileLandscape: false,
        isMobilePortrait: false,
        screenWidth: 1024,
        screenHeight: 768,
      };
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isLandscape = w > h;
    const isMobile = checkIsMobile();
    // Mobile landscape activates on touch mobile devices when in landscape, or if screen height is compact (<= 560px with landscape aspect)
    const isMobileLandscape = isLandscape && (isMobile || (h <= 560 && (w / h) >= 1.25));
    const isMobilePortrait = !isLandscape && isMobile;

    return {
      isLandscape,
      isMobile,
      isMobileLandscape,
      isMobilePortrait,
      screenWidth: w,
      screenHeight: h,
    };
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isLandscape = w > h;
      const isMobile = checkIsMobile();
      const isMobileLandscape = isLandscape && (isMobile || (h <= 560 && (w / h) >= 1.25));
      const isMobilePortrait = !isLandscape && isMobile;

      setInfo({
        isLandscape,
        isMobile,
        isMobileLandscape,
        isMobilePortrait,
        screenWidth: w,
        screenHeight: h,
      });
    };

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    if (screen.orientation) {
      screen.orientation.addEventListener('change', update);
    }

    const mql = window.matchMedia('(orientation: landscape)');
    if (mql.addEventListener) {
      mql.addEventListener('change', update);
    } else {
      mql.addListener(update);
    }

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', update);
      }
      if (mql.removeEventListener) {
        mql.removeEventListener('change', update);
      } else {
        mql.removeListener(update);
      }
    };
  }, []);

  return info;
}
