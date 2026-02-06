import React, { useEffect } from 'react';

interface CoinPopupProps {
  amount: number;
  reason: string;
  onClose: () => void;
}

const CoinPopup: React.FC<CoinPopupProps> = ({ amount, reason, onClose }) => {
  useEffect(() => {
    // Auto close after 3 seconds
    const timer = setTimeout(() => {
        onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center animate-bounce-slow">
        {/* 3D Coin Effect */}
        <div className="w-48 h-48 mb-6 perspective-1000">
            <div className="w-full h-full relative preserve-3d animate-rotate-3d">
                {/* Front */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 border-4 border-yellow-200 shadow-[0_0_60px_rgba(234,179,8,0.6)] flex items-center justify-center">
                    <i className="fas fa-gem text-6xl text-yellow-100 drop-shadow-md"></i>
                </div>
                {/* Back (Simulated by same face rotating) */}
            </div>
        </div>

        <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg mb-2 transform scale-110">
            +{amount}
        </h2>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 font-bold text-xl px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
            {reason}
        </div>
        
        <p className="text-white/60 text-xs mt-8 animate-pulse">Tap anywhere to collect</p>
      </div>
    </div>
  );
};

export default CoinPopup;