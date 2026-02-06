import React, { useRef, useEffect } from 'react';
import { TABS } from '../constants';

interface TabFilterProps {
  currentTab: string;
  onSelect: (tab: string) => void;
}

const TabFilter: React.FC<TabFilterProps> = ({ currentTab, onSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Optional: Auto scroll active tab into view
  useEffect(() => {
     // Logic to center active element could go here
  }, [currentTab]);

  return (
    <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide snap-x"
    >
      {TABS.map((tab) => {
        const isActive = currentTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`
              whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 snap-center
              border
              ${isActive 
                ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200 transform scale-105' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }
            `}
          >
            {tab === 'All' ? 'All Pakistan' : tab.includes('Offer') ? tab : `${tab} Offer`}
          </button>
        );
      })}
    </div>
  );
};

export default TabFilter;
