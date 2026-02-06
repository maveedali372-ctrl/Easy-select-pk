import React, { useState } from 'react';
import { PackageData } from '../types';

interface ConfirmationModalProps {
  pkg: PackageData | null;
  onConfirm: (targetNumber: string) => void;
  onCancel: () => void;
  coinMultiplier: number;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ pkg, onConfirm, onCancel, coinMultiplier }) => {
  const [targetNumber, setTargetNumber] = useState('');
  
  if (!pkg) return null;

  const isCoinLocked = pkg.coinRequired !== false;
  const coinCost = isCoinLocked ? (parseInt(pkg.price) * coinMultiplier) : 0;

  const handleSubmit = () => {
    if (targetNumber.length < 10) {
        alert("Please enter a valid phone number");
        return;
    }
    onConfirm(targetNumber);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-opacity animate-fade-in" 
            onClick={onCancel}
        ></div>
        
        {/* Modal Card */}
        <div className="bg-white rounded-[2rem] p-6 w-full max-w-xs sm:max-w-sm shadow-2xl relative z-10 animate-fade-in-up transform transition-all">
            <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner ${isCoinLocked ? 'bg-yellow-50' : 'bg-green-50'}`}>
                    {isCoinLocked ? (
                        <i className="fas fa-coins text-2xl text-yellow-500"></i>
                    ) : (
                        <i className="fas fa-gift text-2xl text-green-500"></i>
                    )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">Confirm Order</h3>
                <p className="text-xs text-slate-400 mb-4">
                    {isCoinLocked ? 'Total coins to be deducted' : 'This package is free!'}
                </p>
                
                <div className={`text-3xl font-black mb-6 flex items-center justify-center gap-2 ${isCoinLocked ? 'text-slate-800' : 'text-green-500'}`}>
                    {isCoinLocked ? (
                        <>
                            <i className="fas fa-coins text-yellow-500 text-xl"></i> {coinCost}
                        </>
                    ) : (
                        'FREE'
                    )}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                        Enter Target Number
                    </label>
                    <input 
                        type="number"
                        placeholder="03xxxxxxxxx"
                        value={targetNumber}
                        onChange={(e) => setTargetNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-lg font-bold text-slate-800 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    />
                    <p className="text-[10px] text-slate-400 mt-2">
                        This package will be activated on this number.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!targetNumber}
                        className={`
                            flex-1 py-3.5 rounded-xl font-bold text-slate-900 shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                            ${isCoinLocked ? 'bg-yellow-400 hover:bg-yellow-300 shadow-yellow-200' : 'bg-green-400 hover:bg-green-300 shadow-green-200'}
                        `}
                    >
                        {isCoinLocked ? 'Pay Coins' : 'Get It Now'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ConfirmationModal;