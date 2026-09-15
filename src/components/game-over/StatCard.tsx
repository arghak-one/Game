import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  highlightColor?: string;
  delayMs?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  unit,
  highlightColor = 'text-amber-300',
  delayMs = 0,
}) => {
  return (
    <div
      className="flex-1 bg-neutral-950/80 border border-amber-500/30 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center shadow-inner relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-amber-400/60"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {/* Top subtle golden shimmer line */}
      <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      {/* Label and Icon */}
      <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
        <span className="text-amber-400 text-xs sm:text-sm">{icon}</span>
        <span className="text-[9px] sm:text-[10px] font-bold text-amber-200/70 tracking-widest font-festive uppercase">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-0.5">
        <span className={`text-base sm:text-lg font-black font-yatra tracking-wide ${highlightColor}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="text-[10px] text-amber-300/70 font-semibold font-festive ml-0.5">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
