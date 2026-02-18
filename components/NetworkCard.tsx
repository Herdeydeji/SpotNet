
import React from 'react';
import { COLORS } from '../constants.ts';

interface NetworkCardProps {
  title: string;
  value: string | number;
  unit?: string;
  explanation: string;
  icon?: React.ReactNode;
  accentColor?: string;
  loading?: boolean;
}

const NetworkCard: React.FC<NetworkCardProps> = ({ 
  title, 
  value, 
  unit, 
  explanation, 
  icon, 
  accentColor = COLORS.PRIMARY,
  loading = false
}) => {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
      {/* Background Accent Glow */}
      <div 
        className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-[0.03] transition-opacity group-hover:opacity-[0.07]"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            {title}
          </span>
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-sm transition-colors group-hover:bg-white/10"
            style={{ color: accentColor }}
          >
            {icon}
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold tracking-tight transition-all duration-300 ${loading ? 'opacity-40 scale-95 blur-[2px]' : 'opacity-100 scale-100'}`}>
            {value}
          </span>
          {unit && !loading && (
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
              {unit}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <p className="min-h-[32px] text-[11px] leading-relaxed text-slate-400">
            {explanation}
          </p>
          
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div 
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out ${loading ? 'animate-pulse' : ''}`}
              style={{ 
                backgroundColor: accentColor,
                width: loading ? '30%' : '100%',
                boxShadow: `0 0 10px ${accentColor}80`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkCard;
