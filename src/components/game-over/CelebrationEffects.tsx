import React from 'react';

export const CelebrationEffects: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Glowing Firefly Sparks / Embers */}
      <div className="absolute bottom-28 left-[12%] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b] animate-ember-1" />
      <div className="absolute bottom-36 left-[84%] w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047] animate-ember-2" />
      <div className="absolute bottom-48 left-[24%] w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#ea580c] animate-ember-3" />
      <div className="absolute bottom-24 left-[72%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ember-4" />

      {/* Floating Festive Flower Petals */}
      <div className="absolute top-[22%] left-[8%] text-sm opacity-70 animate-float-subtle">
        🌸
      </div>
      <div
        className="absolute top-[32%] right-[10%] text-xs opacity-65 animate-float-subtle"
        style={{ animationDelay: '1.2s' }}
      >
        🌼
      </div>
      <div
        className="absolute bottom-[35%] left-[6%] text-xs opacity-60 animate-float-subtle"
        style={{ animationDelay: '2.5s' }}
      >
        🌸
      </div>
      <div
        className="absolute bottom-[40%] right-[7%] text-sm opacity-60 animate-float-subtle"
        style={{ animationDelay: '1.8s' }}
      >
        🌺
      </div>
    </div>
  );
};
