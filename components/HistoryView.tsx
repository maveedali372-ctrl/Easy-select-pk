import React from 'react';
import { HistoryItem } from '../types';
import { NETWORKS } from '../constants';
import HistoryAd from './HistoryAd';

interface HistoryViewProps {
  history: HistoryItem[];
  showAds?: boolean;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, showAds = true }) => {
  return (
    <div className="px-5 pt-4 pb-24 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-2">My Orders</h2>
      
      {/* History Ad Placement */}
      {showAds && <HistoryAd />}

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] opacity-50 mt-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-history text-2xl text-slate-300"></i>
            </div>
            <p className="text-slate-500 font-medium">No order history</p>
            <p className="text-slate-400 text-xs">Packages you buy will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
            {history.map((item, index) => {
            const netConfig = NETWORKS.find(n => n.id === item.package.net);
            const dateObj = new Date(item.timestamp);
            const isPending = item.status === 'Pending';
            
            return (
                <div key={`${item.package.id}-${index}`} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative overflow-hidden">
                {/* Network Stripe */}
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
            })}
        </div>
      )}
    </div>
  );
};

export default HistoryView;