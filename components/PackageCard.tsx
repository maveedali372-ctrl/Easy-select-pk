import React from 'react';
import { PackageData } from '../types';

interface PackageCardProps {
  pkg: PackageData;
  userCoins: number;
  onActivate: (pkg: PackageData) => void;
  coinMultiplier: number;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, userCoins, onActivate, coinMultiplier }) => {
  
  // Calculate Cost
  const coinCost = parseInt(pkg.price) * coinMultiplier;
  
  // Check if coins are required (default true)
  const isCoinLocked = pkg.coinRequired !== false;
  
  const canAfford = !isCoinLocked || userCoins >= coinCost;

  // Use provided validity or fallback
  const displayValidity = pkg.validity || pkg.type;

  // Data mapping for Grid
  // If specifics aren't there, we parse 'info' string loosely or show 0
  const internet = pkg.internet || (pkg.info.includes('GB') ? pkg.info.split(',')[0] : '0 MB');
  const onNet = pkg.onNet || (pkg.info.toLowerCase().includes(pkg.net) ? 'Unlim' : '0');
  const offNet = pkg.offNet || '0';
  const sms = pkg.sms || '0';

  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden transition-all hover:shadow-lg">
      
      {/* "New" Ribbon */}
      <div className="absolute top-0 right-0">
         <div className="bg-[#e91e63] text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl shadow-sm z-10">
            New
         </div>
         {/* Triangle effect for ribbon */}
         <div className="absolute top-0 right-full w-2 h-full bg-[#c2185b] rounded-tl-full -z-10"></div>
      </div>

      {/* Header Row */}
      <div className="flex justify-between items-start mb-1 pr-10">
         <h3 className="font-bold text-slate-900 text-lg leading-tight w-[70%]">
             {pkg.name}
         </h3>
         <div className="text-right">
             <div className="text-[#8cc34a] font-bold text-lg leading-none">{pkg.price} PKR</div>
             <div className="text-[9px] text-slate-400">incl. tax</div>
         </div>
      </div>

      {/* Validity Subtitle */}
      <p className="text-slate-500 text-xs font-medium mb-4">{displayValidity}</p>

      {/* Resource Grid (Furniture) */}
      <div className="flex border border-slate-100 rounded-xl mb-5 divide-x divide-slate-100 bg-slate-50/50">
          
          {/* Column 1: Internet */}
          <div className="flex-1 py-3 px-1 flex flex-col items-center justify-center text-center">
              <span className="text-slate-800 font-bold text-sm leading-tight">
                  {internet.replace(/([0-9]+)/, '$1 ')}
              </span>
              <span className="text-[9px] text-slate-400 mt-1">Internet</span>
          </div>

          {/* Column 2: Off-net */}
          <div className="flex-1 py-3 px-1 flex flex-col items-center justify-center text-center">
              <span className="text-slate-800 font-bold text-sm leading-tight">
                  {offNet}
              </span>
              <span className="text-[9px] text-slate-400 mt-1">Off-net Mins</span>
          </div>

          {/* Column 3: On-net */}
          <div className="flex-1 py-3 px-1 flex flex-col items-center justify-center text-center">
              <span className="text-slate-800 font-bold text-sm leading-tight">
                  {onNet}
              </span>
              <span className="text-[9px] text-slate-400 mt-1">Network Mins</span>
          </div>

          {/* Column 4: SMS */}
          <div className="flex-1 py-3 px-1 flex flex-col items-center justify-center text-center">
               <span className="text-slate-800 font-bold text-sm leading-tight">
                  {sms}
              </span>
              <span className="text-[9px] text-slate-400 mt-1">SMS</span>
          </div>
      </div>

      {/* Footer / Action */}
      <div className="flex items-center gap-3">
          {/* Favorite Button (Visual) */}
          <button className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-white text-xl hover:bg-slate-300 transition-colors">
              <i className="fas fa-star"></i>
          </button>

          {/* Subscribe / Action Button */}
          {isCoinLocked ? (
              <button 
                 onClick={() => onActivate(pkg)}
                 disabled={!canAfford}
                 className={`
                    flex-1 h-12 rounded-xl font-bold text-white shadow-lg shadow-pink-200 flex items-center justify-center gap-2 transition-transform active:scale-95
                    ${canAfford ? 'bg-[#e91e63] hover:bg-[#d81b60]' : 'bg-slate-400 cursor-not-allowed grayscale'}
                 `}
              >
                 {canAfford ? (
                     <>
                        <span>Subscribe Now</span>
                        <span className="bg-black/10 px-2 py-0.5 rounded text-[10px] ml-1">
                            {coinCost} Coins
                        </span>
                     </>
                 ) : (
                     <>Low Coins ({coinCost})</>
                 )}
              </button>
          ) : (
              <a 
                 href={`tel:${pkg.code.replace('#', '%23')}`}
                 className="flex-1 h-12 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-transform active:scale-95 no-underline"
              >
                 <span className="text-lg tracking-wider">{pkg.code}</span>
                 <i className="fas fa-phone-alt text-xs"></i>
              </a>
          )}
      </div>

    </div>
  );
};

export default PackageCard;