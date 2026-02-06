
import React from 'react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { name: 'Home', icon: 'fa-home' },
    { name: 'Offers', icon: 'fa-gift' },
    { name: 'History', icon: 'fa-history' },
    { name: 'Profile', icon: 'fa-user' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] px-6 py-3 flex justify-between items-center z-50 rounded-t-[20px]">
      {navItems.map((item) => {
        const isActive = activeTab === item.name;
        return (
          <button 
            key={item.name}
            onClick={() => onTabChange(item.name)}
            className={`flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? 'text-telenor' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`text-lg transition-transform ${isActive ? '-translate-y-1' : ''}`}>
                <i className={`fas ${item.icon}`}></i>
            </div>
            <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.name}
            </span>
            {isActive && <div className="w-1 h-1 bg-telenor rounded-full mt-0.5"></div>}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
