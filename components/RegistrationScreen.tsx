import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface RegistrationScreenProps {
  onRegister: (user: UserProfile, referralCode?: string) => void;
  initialReferralCode?: string;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister, initialReferralCode }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialReferralCode) {
        setReferralCode(initialReferralCode);
    }
  }, [initialReferralCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    // Pass data back to App.tsx
    // Initial coins are handled in App.tsx now
    onRegister({ name, phone, coins: 0 }, referralCode); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 bg-white z-50 animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
             <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center shadow-inner overflow-hidden border-4 border-blue-100">
                <img 
                    src="https://i.ibb.co/qMGPnq6d/1770319951300.png" 
                    alt="EasySelect PK Logo" 
                    className="w-full h-full object-cover"
                />
             </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-2">EasySelect PK</h2>
        <p className="text-slate-500 text-sm mb-4">Register to see the best offers for your city</p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-8 flex items-center justify-center gap-3">
            <i className="fas fa-gift text-yellow-500 text-xl animate-bounce"></i>
            <span className="text-yellow-700 text-xs font-bold">Get 20 Coins Bonus on Registration!</span>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1 text-left">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
             <input
                type="text"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-telenor focus:border-transparent transition-all"
                placeholder="e.g. Shamshad Khaton"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                }}
             />
          </div>

          <div className="space-y-1 text-left">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
             <input
                type="number"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-telenor focus:border-transparent transition-all"
                placeholder="03xxxxxxxxx"
                value={phone}
                onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                }}
             />
          </div>

          <div className="space-y-1 text-left">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Referral Code (Optional)</label>
             <div className="relative">
                 <input
                    type="text"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-telenor focus:border-transparent transition-all pl-12"
                    placeholder="Enter friend's number"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                 />
                 <div className="absolute left-4 top-0 bottom-0 flex items-center">
                    <i className="fas fa-users text-slate-400"></i>
                 </div>
             </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full mt-6 py-4 bg-telenor hover:bg-sky-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 transition-transform active:scale-95"
          >
            REGISTER & CLAIM BONUS
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationScreen;