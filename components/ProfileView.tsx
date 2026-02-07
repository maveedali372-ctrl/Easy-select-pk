import React from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onOpenAdmin: () => void;
  balance: string;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onOpenAdmin, balance, onLogout }) => {
  
  const handleInviteClick = async () => {
    // Generate Invite Link
    const baseUrl = window.location.href.split('?')[0];
    const inviteLink = `${baseUrl}?ref=${user.phone}`;
    
    const shareData = {
        title: 'EasySelect PK',
        text: `Hey! Join EasySelect PK and get 20 Coins FREE! Use my referral code ${user.phone} or click:`,
        url: inviteLink
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Share canceled');
        }
    } else {
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert(`Invite Link Copied!\n\nLink: ${inviteLink}\n\nSend this to friends. When they register, you get 100 Coins!`);
    }
  };

  // Increased top padding to look good without the main header
  return (
    <div className="p-6 pt-12 animate-fade-in pb-10">
      <div className="bg-white rounded-3xl p-6 shadow-md text-center mb-6 border border-slate-100">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-blue-200 shadow-lg">
            {user.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
        <p className="text-slate-500 text-sm font-mono mt-1">{user.phone}</p>
        
        <div className="mt-6 flex justify-center gap-4">
             <div className="text-center px-4 py-2 bg-blue-50 rounded-2xl">
                <div className="text-xs text-slate-400 font-bold uppercase">Balance</div>
                <div className="text-lg font-bold text-blue-600">Rs. {balance}</div>
             </div>
             <div className="text-center px-4 py-2 bg-green-50 rounded-2xl">
                <div className="text-xs text-slate-400 font-bold uppercase">Status</div>
                <div className="text-lg font-bold text-green-600">Active</div>
             </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Admin Control - Moved to top for easier access */}
        {user.phone === '03198428224' && (
            <button 
                onClick={onOpenAdmin}
                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 rounded-2xl shadow-lg shadow-slate-300 flex items-center justify-between group active:scale-95 transition-all mb-4 border border-slate-700"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-yellow-400">
                        <i className="fas fa-shield-alt text-xl"></i>
                    </div>
                    <div className="text-left">
                        <span className="font-bold block text-lg text-yellow-400">Admin Console</span>
                        <span className="text-xs text-slate-400 font-normal">Tap to manage app</span>
                    </div>
                </div>
                <i className="fas fa-chevron-right text-slate-500 group-hover:text-white transition-colors"></i>
            </button>
        )}

        {/* Invite Feature */}
        <button 
            onClick={handleInviteClick}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-purple-200 flex items-center justify-between group active:scale-95 transition-all mb-4"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white animate-pulse">
                    <i className="fas fa-user-plus text-xl"></i>
                </div>
                <div className="text-left">
                    <span className="font-bold block text-lg">Invite & Earn</span>
                    <span className="text-xs text-purple-100 font-normal">Share app link & get <span className="font-bold text-yellow-300">100 Coins</span></span>
                </div>
            </div>
            <i className="fas fa-share-alt text-purple-200"></i>
        </button>

        <button className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <i className="fas fa-cog"></i>
                </div>
                <span className="font-bold text-slate-700">Settings</span>
            </div>
            <i className="fas fa-chevron-right text-slate-300"></i>
        </button>
        
        {/* Logout Button */}
        <button 
            onClick={onLogout}
            className="w-full bg-red-50 text-red-500 p-4 rounded-2xl border border-red-100 flex items-center justify-center gap-2 mt-4 active:scale-95 transition-transform"
        >
            <i className="fas fa-sign-out-alt"></i>
            <span className="font-bold">Logout</span>
        </button>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400">App Version 2.0.5</p>
      </div>
    </div>
  );
};

export default ProfileView;