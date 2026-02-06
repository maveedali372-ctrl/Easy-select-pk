import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  userName: string;
  coins: number;
  onWatchAd: () => void;
}

const AdModal: React.FC<{ onClose: () => void; onClaim: () => void }> = ({ onClose, onClaim }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [canClaim, setCanClaim] = useState(false);

    useEffect(() => {
        // Write the ad script to iframe safely
        if (iframeRef.current && iframeRef.current.contentWindow) {
            const doc = iframeRef.current.contentWindow.document;
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background-color: transparent; }
                    </style>
                </head>
                <body>
                    <script type="text/javascript">
                        atOptions = {
                            'key' : 'b562c6ebefa346197800c1a52f303d65',
                            'format' : 'iframe',
                            'height' : 50,
                            'width' : 320,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="https://www.highperformanceformat.com/b562c6ebefa346197800c1a52f303d65/invoke.js"></script>
                </body>
                </html>
            `);
            doc.close();
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanClaim(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={canClaim ? onClose : undefined}></div>
             <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl animate-fade-in-up">
                 <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                        <i className="fas fa-play text-yellow-500 text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Watch Ad</h3>
                    <p className="text-xs text-slate-500">Wait {timeLeft}s to earn rewards</p>
                 </div>

                 <div className="bg-slate-50 border-2 border-slate-100 border-dashed rounded-xl flex items-center justify-center py-2 mb-6 overflow-hidden relative min-h-[60px]">
                    <iframe 
                        ref={iframeRef} 
                        width="320" 
                        height="50" 
                        title="Ad Container"
                        scrolling="no"
                        style={{ border: 'none', maxWidth: '100%', display: 'block' }}
                    ></iframe>
                 </div>

                 {canClaim ? (
                     <button 
                        onClick={onClaim}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 transform hover:scale-105 transition-all flex items-center justify-center gap-2 animate-bounce-slow"
                     >
                        <i className="fas fa-check-circle"></i> Claim +5 Coins
                     </button>
                 ) : (
                     <button 
                        disabled
                        className="w-full py-4 bg-slate-200 text-slate-400 font-bold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
                     >
                        <i className="fas fa-clock fa-spin"></i> Please Wait {timeLeft}s
                     </button>
                 )}

                 <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                    <i className="fas fa-times"></i>
                 </button>
             </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ userName, coins, onWatchAd }) => {
  const [showAdModal, setShowAdModal] = useState(false);

  const handleAdClick = () => {
    setShowAdModal(true);
  };

  const handleClaimReward = () => {
      setShowAdModal(false);
      onWatchAd(); // This triggers the coin update in Dashboard
  };

  return (
    <div className="relative mb-24">
      {/* Main Blue Background */}
      <div className="bg-gradient-to-r from-[#0099dd] to-[#0088cc] pb-24 pt-8 px-5 rounded-b-[2.5rem] shadow-md relative overflow-hidden">
        
        {/* Decorative Circle (Subtle) */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Bar */}
        <div className="flex justify-between items-start text-white relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-bold uppercase tracking-tight truncate max-w-[200px]">
                {userName}
              </h1>
              <i className="fas fa-pencil-alt text-[10px] opacity-80 cursor-pointer"></i>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
              <span className="text-sm font-medium tracking-wide">Level 1 User</span>
              <i className="fas fa-shield-alt text-xs"></i>
            </div>
          </div>
          
          <div className="flex gap-4 mt-1">
            <button className="text-white hover:opacity-80 transition-opacity">
                <i className="fas fa-search text-xl"></i>
            </button>
            <button className="text-white hover:opacity-80 transition-opacity">
                <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Coin Wallet Card */}
      <div className="absolute left-4 right-4 -bottom-16 bg-white rounded-3xl shadow-xl p-5 z-20 animate-fade-in-up">
        {/* Top Row */}
        <div className="flex justify-between items-start mb-2">
            <div>
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Your Wallet</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
                <i className="fas fa-crown text-xs"></i>
                <span className="text-[10px] font-bold">Premium</span>
            </div>
        </div>

        {/* Coins Display */}
        <div className="flex justify-between items-end relative">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <i className="fas fa-coins text-yellow-500 text-2xl"></i>
                </div>
                <div>
                    <div className="flex items-baseline gap-1 text-slate-800">
                        <span className="text-4xl font-extrabold tracking-tight">{coins}</span>
                        <span className="text-sm font-bold text-slate-400">Coins</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                        Earn more to unlock packages
                    </div>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5">
            <button 
                onClick={handleAdClick}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-2 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
                <div className="w-6 h-6 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-[10px]">
                    <i className="fas fa-play"></i>
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-xs font-bold">Watch Video Ad</span>
                    <span className="text-[10px] text-yellow-400 font-bold">+5 Coins Reward</span>
                </div>
            </button>
        </div>
      </div>

      {/* Ad Modal Overlay */}
      {showAdModal && (
          <AdModal onClose={() => setShowAdModal(false)} onClaim={handleClaimReward} />
      )}
    </div>
  );
};

export default Header;