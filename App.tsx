import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import RegistrationScreen from './components/RegistrationScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [coinMultiplier, setCoinMultiplier] = useState<number>(20);
  const [welcomeBonus, setWelcomeBonus] = useState<number>(20);
  const [referralCodeFromUrl, setReferralCodeFromUrl] = useState<string>('');

  // Check for existing session and URL params on load
  useEffect(() => {
    // 1. Check URL for referral code
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setReferralCodeFromUrl(ref);

    // 2. Check Session
    const savedSession = localStorage.getItem('easyselect_pk_user');
    if (savedSession) {
        try {
            const sessionUser = JSON.parse(savedSession);
            
            // 3. Load Fresh Data from Mock DB (to sync coins from referrals)
            const dbStr = localStorage.getItem('easyselect_mock_db');
            if (dbStr) {
                const db = JSON.parse(dbStr);
                const freshUser = db[sessionUser.phone];
                if (freshUser) {
                    setUser(freshUser);
                } else {
                    // Fallback if not in DB yet
                    setUser(sessionUser);
                }
            } else {
                setUser(sessionUser);
            }
        } catch (e) {
            console.error("Failed to parse user data", e);
        }
    }
    setLoading(false);
  }, []);

  const handleRegister = (newUser: UserProfile, usedReferralCode?: string) => {
    // Load Mock DB
    const dbStr = localStorage.getItem('easyselect_mock_db');
    let db: Record<string, UserProfile> = dbStr ? JSON.parse(dbStr) : {};

    // Check if user already exists (Login logic)
    if (db[newUser.phone]) {
        const existingUser = db[newUser.phone];
        setUser(existingUser);
        localStorage.setItem('easyselect_pk_user', JSON.stringify(existingUser));
        setIsNewUser(false);
        return;
    }

    // New User Registration
    const coins = welcomeBonus; 
    
    // Process Referral Reward
    if (usedReferralCode && db[usedReferralCode] && usedReferralCode !== newUser.phone) {
        // Credit the Inviter (100 coins)
        const inviter = db[usedReferralCode];
        inviter.coins = (inviter.coins || 0) + 100;
        db[usedReferralCode] = inviter;
        console.log(`Referral Successful! Credited 100 coins to ${inviter.name}`);
    }

    // Create New User Object
    const userToSave = { ...newUser, coins };
    db[newUser.phone] = userToSave;

    // Save everything
    localStorage.setItem('easyselect_mock_db', JSON.stringify(db));
    localStorage.setItem('easyselect_pk_user', JSON.stringify(userToSave));
    
    setUser(userToSave);
    setIsNewUser(true); // Show welcome popup
  };

  const handleLogout = () => {
    localStorage.removeItem('easyselect_pk_user');
    setUser(null);
    setIsNewUser(false);
    // Force reload to clear any ad scripts from memory/DOM
    window.location.reload(); 
  };

  if (loading) return null;

  return (
    <div className="min-h-screen w-full bg-bg-gray font-sans relative">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
        {!user ? (
          <RegistrationScreen 
            onRegister={handleRegister} 
            initialReferralCode={referralCodeFromUrl}
          />
        ) : (
          <Dashboard 
            user={user} 
            coinMultiplier={coinMultiplier}
            setCoinMultiplier={setCoinMultiplier}
            welcomeBonus={welcomeBonus}
            setWelcomeBonus={setWelcomeBonus}
            isNewUser={isNewUser}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

export default App;