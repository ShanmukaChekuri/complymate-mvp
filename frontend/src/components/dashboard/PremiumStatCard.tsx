import { useEffect, useRef, useState } from 'react';

interface PremiumStatCardProps {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  progress: number; // 0-100
  trend?: 'up' | 'down' | null;
  trendValue?: number;
  onClick?: () => void;
}

export default function PremiumStatCard({
  label,
  value,
  description,
  icon,
  gradient,
  progress,
  trend = null,
  trendValue = 0,
  onClick,
}: PremiumStatCardProps) {
  // Animated count up
  const [displayValue, setDisplayValue] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value]);

  // Progress ring SVG
  const radius = 22;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative cursor-pointer select-none transition-transform duration-200 hover:-translate-y-1"
      style={{
        background: gradient,
        borderRadius: 12,
        boxShadow: '0px 1px 3px rgba(0,0,0,0.10), 0px 1px 2px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        minHeight: 160,
        overflow: 'hidden',
      }}
      onClick={onClick}
      tabIndex={0}
      aria-label={label}
    >
      {/* Glass overlay */}
      <div
        className="absolute inset-0 bg-white/10 pointer-events-none"
        style={{ backdropFilter: 'blur(8px)' }}
      />
      <div className="relative z-10 flex flex-col h-full justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div className="ml-auto">
            <svg width={radius * 2} height={radius * 2}>
              <circle
                stroke="#e5e7eb"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#fff"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{
                  strokeDashoffset: offset,
                  transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1)',
                }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-white drop-shadow-sm">{displayValue}</span>
            {trend && (
              <span
                className={`flex items-center text-sm font-semibold ${
                  trend === 'up' ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {trend === 'up' ? '▲' : '▼'} {trendValue}%
              </span>
            )}
          </div>
          <div className="text-white/80 text-sm mt-1 font-medium">{label}</div>
          <div className="text-white/60 text-xs mt-1">{description}</div>
        </div>
      </div>
    </div>
  );
}
