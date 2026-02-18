
import React from 'react';
import { COLORS } from '../constants.ts';

interface NetworkCardProps {
  title: string;
  value: string | number;
  unit?: string;
  explanation: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

const NetworkCard: React.FC<NetworkCardProps> = ({ 
  title, 
  value, 
  unit, 
  explanation, 
  icon, 
  accentColor = COLORS.PRIMARY 
}) => {
  return (
    <div className="bg-[#122647] rounded-2xl p-6 border border-white/5 shadow-xl transition-all hover:border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium tracking-wider uppercase">{title}</h3>
        {icon && <div style={{ color: accentColor }}>{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-bold tracking-tight text-white">{value}</span>
        {unit && <span className="text-gray-500 font-medium text-lg">{unit}</span>}
      </div>
      <p className="text-gray-400 text-xs leading-relaxed">
        {explanation}
      </p>
      <div 
        className="h-1 w-full mt-4 rounded-full overflow-hidden bg-white/5"
      >
        <div 
          className="h-full transition-all duration-1000" 
          style={{ 
            backgroundColor: accentColor,
            width: '100%' 
          }}
        />
      </div>
    </div>
  );
};

export default NetworkCard;
