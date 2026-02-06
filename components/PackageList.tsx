
import React from 'react';
import { PackageData } from '../types';
import PackageCard from './PackageCard';

interface PackageListProps {
  packages: PackageData[];
  userCoins: number;
  onActivate: (pkg: PackageData) => void;
  coinMultiplier: number;
}

const PackageList: React.FC<PackageListProps> = ({ packages, userCoins, onActivate, coinMultiplier }) => {
  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
        <i className="fas fa-box-open text-4xl mb-4 text-slate-300"></i>
        <p className="text-slate-500 font-medium">No packages found.</p>
        <p className="text-slate-400 text-sm">Try changing filters or search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {packages.map((pkg) => (
        <PackageCard 
            key={pkg.id} 
            pkg={pkg} 
            userCoins={userCoins} 
            onActivate={onActivate} 
            coinMultiplier={coinMultiplier}
        />
      ))}
    </div>
  );
};

export default PackageList;
