import React from 'react';
import { NETWORKS } from '../constants';
import { NetworkType } from '../types';

interface NetworkSelectorProps {
  currentNet: NetworkType;
  onSelect: (net: NetworkType) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ currentNet, onSelect }) => {
  return (
    <div className="flex justify-around items-center py-2 px-2">
      {NETWORKS.map((net) => {
        const isActive = currentNet === net.id;
        
        return (
          <button
            key={net.id}
            onClick={() => onSelect(net.id)}
            className={`
              relative flex items-center justify-center 
              w-16 h-16 sm:w-20 sm:h-20 
              rounded-full bg-white shadow-md 
              transition-all duration-300 ease-out
              ${isActive ? 'scale-110 ring-4 ring-offset-2 z-10' : 'opacity-90 hover:scale-105'}
            `}
            style={{ 
                // Using inline styles for dynamic ring color based on network brand
                '--tw-ring-color': net.color 
            } as React.CSSProperties}
          >
            <img 
              src={net.logo} 
              alt={net.name} 
              className="w-[80%] h-[80%] rounded-full object-cover pointer-events-none select-none"
            />
            {isActive && (
                <div 
                    className="absolute -bottom-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: net.color }}
                >
                    {net.name}
                </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NetworkSelector;
