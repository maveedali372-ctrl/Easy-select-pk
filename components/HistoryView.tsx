import React, { useState, useEffect } from 'react';
import { HistoryItem, Promotion } from '../types';
import { NETWORKS } from '../constants';
import HistoryAd from './HistoryAd';

interface HistoryViewProps {
  history: HistoryItem[];
  showAds?: boolean;
  activePromotions?: Promotion[];
  onPromoClick: (packageId?: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, showAds = true, activePromotions = [], onPromoClick }) => {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // Auto-slide effect for Promotions
  useEffect(() => {
    if (activePromotions.length > 1) {
        const timer = setInterval(() => {
            setCurrentPromoIndex((prev) => (prev + 1) % activePromotions.length);
        }, 5000); // 5 seconds interval
        return () => clearInterval(timer);
    }
  }, [activePromotions.length]);

  return (
    <div className="px-5 pt-4 pb-24 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-2">My History</h2>
      
      {/* Promotions Section (Slider) */}
      {activePromotions.length > 0 && (
          <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Promotions</h3>
                <span className="text-[10px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-bold animate-pulse">Expires in 24h</span>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-200 aspect-[21/9] sm:aspect-[3/1]">
                  {activePromotions.map((promo, index) => (
                      <div 
                        key={promo.id} 
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${index === currentPromoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        onClick={() => onPromoClick(promo.packageId)}
                      >
                          <img 
                              src={promo.imageUrl} 
                              alt="Promotion" 
                              className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                             <div className="flex items-center gap-2">
                                <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded">
                                    {promo.packageId ? 'View Offer' : 'Featured'}
                                </span>
                                {promo.packageId && <i className="fas fa-external-link-alt text-white text-xs"></i>}
                             </div>
                          </div>
                      </div>
                  ))}

                  {/* Dots Indicator */}
                  {activePromotions.length > 1 && (
                      <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5">
                          {activePromotions.map((_, idx) => (
                              <button 
                                  key={idx} 
                                  onClick={() => setCurrentPromoIndex(idx)}
                                  className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentPromoIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5 hover:bg-white/80'}`}
                              />
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )}
      
      {/* History Ad Placement */}
      {showAds && <HistoryAd />}

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] opacity-50 mt-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-history text-2xl text-slate-300"></i>
            </div>
            <p className="text-slate-500 font-medium">No history</p>
            <p className="text-slate-400 text-xs">Packages & videos will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
            {history.map((item, index) => {
            const dateObj = new Date(item.timestamp);
            
            if (item.isVideo && item.video) {
                // Video History Card
                return (
                    <div key={`vid-${item.timestamp}-${index}`} className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex flex-col gap-3 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                        <div className="flex justify-between items-start">
                             <div>
                                 <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                     <i className="fas fa-video text-red-500 text-sm"></i> 
                                     Admin Video Watched
                                 </h4>
                                 <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                                     {item.video.title}
                                 </div>
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                 {item.video.duration} min
                             </span>
                        </div>
                        <div className="w-full h-px bg-slate-50"></div>
                        <div className="flex justify-between items-center">
                             <span className="text-[10px] text-slate-400 font-mono">
                                {dateObj.toLocaleDateString()} • {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </span>
                             <span className="text-[10px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                <i className="fas fa-check-circle"></i> Watched
                             </span>
                        </div>
                    </div>
                );
            }

            // Package History Card
            if (item.package) {
                const netConfig = NETWORKS.find(n => n.id === item.package!.net);
                const isPending = item.status === 'Pending';
                
                return (
                    <div key={`pkg-${item.timestamp}-${index}`} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: netConfig?.color || '#ccc' }}></div>
                    
                    <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-slate-800">{item.package.name}</h4>
                                <div className="text-[10px] font-mono text-slate-500 mt-1">
                                    For: <span className="font-bold text-slate-700 bg-slate-100 px-1 rounded">{item.targetPhone}</span>
                                </div>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                <i className="fas fa-coins text-[10px]"></i>
                                {item.package.price}
                            </span>
                    </div>
                    
                    <div className="w-full h-px bg-slate-50"></div>

                    <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-mono">
                                {dateObj.toLocaleDateString()} • {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            
                            {isPending ? (
                                <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full animate-pulse">
                                    <i className="fas fa-clock"></i> Pending
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                    <i className="fas fa-check-circle"></i> Approved
                                </span>
                            )}
                    </div>
                    </div>
                );
            }
            return null;
            })}
        </div>
      )}
    </div>
  );
};

export default HistoryView;