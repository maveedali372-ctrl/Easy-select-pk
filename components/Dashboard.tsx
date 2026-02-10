import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, NetworkType, PackageData, HistoryItem, AdminVideo, Promotion } from '../types';
import { PACKAGES } from '../constants';
import Header from './Header';
import NetworkSelector from './NetworkSelector';
import TabFilter from './TabFilter';
import PackageList from './PackageList';
import BottomNav from './BottomNav';
import ConfirmationModal from './ConfirmationModal';
import HistoryView from './HistoryView';
import AdminPanel from './AdminPanel';
import ProfileView from './ProfileView';
import CoinPopup from './CoinPopup';
import BannerSlider from './BannerSlider';
import DashboardAd from './DashboardAd';
import PopunderAd from './PopunderAd';
import NewsModal from './NewsModal';

interface DashboardProps {
  user: UserProfile;
  coinMultiplier: number;
  setCoinMultiplier: (val: number) => void;
  welcomeBonus: number;
  setWelcomeBonus: (val: number) => void;
  isNewUser?: boolean;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user: initialUser, coinMultiplier, setCoinMultiplier, welcomeBonus, setWelcomeBonus, isNewUser, onLogout }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('Home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);

  // User State (Coins, etc.)
  const [userCoins, setUserCoins] = useState(initialUser.coins || 0);

  // Data State
  const [allPackages, setAllPackages] = useState<PackageData[]>(PACKAGES);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Videos & Promotions State
  const [adminVideos, setAdminVideos] = useState<AdminVideo[]>([
      { id: 'v1', title: 'Welcome to EasySelect PK!', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', sourceType: 'embed', duration: 1, timestamp: Date.now(), likes: 120, dislikes: 5 }
  ]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  
  // Filter State
  const [currentNet, setCurrentNet] = useState<NetworkType>('telenor');
  const [currentTab, setCurrentTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPkg, setSelectedPkg] = useState<PackageData | null>(null);

  // Popup State
  const [popupConfig, setPopupConfig] = useState<{show: boolean, amount: number, reason: string}>({
    show: false, 
    amount: 0, 
    reason: ''
  });

  // Admin Check (Hardcoded as per requirement)
  const isAdminUser = initialUser.phone === '03198428224';

  // Check for Welcome Bonus on Mount
  useEffect(() => {
    if (isNewUser) {
        setPopupConfig({
            show: true,
            amount: welcomeBonus,
            reason: 'Welcome Bonus'
        });
    }
  }, [isNewUser, welcomeBonus]);

  // Sync userCoins if prop changes (e.g. re-login logic)
  useEffect(() => {
    setUserCoins(initialUser.coins);
  }, [initialUser]);

  // --- 24 HOUR EXPIRY LOGIC ---
  // We filter out videos and promotions older than 24 hours for the USER view.
  // The Admin usually sees everything or we can filter there too, but let's filter globally for display.
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  
  const activeVideos = useMemo(() => {
      // Show only videos created in last 24 hours
      return adminVideos.filter(v => (Date.now() - v.timestamp) < ONE_DAY_MS);
  }, [adminVideos]);

  const activePromotions = useMemo(() => {
      // Show only promotions created in last 24 hours
      return promotions.filter(p => (Date.now() - p.timestamp) < ONE_DAY_MS);
  }, [promotions]);


  // Derived state for filtered packages
  const filteredPackages = useMemo(() => {
    let result = allPackages.filter(p => p.net === currentNet);

    if (currentTab !== 'All') {
      result = result.filter(p => p.city === currentTab || p.type === currentTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }

    return result;
  }, [currentNet, currentTab, searchQuery, allPackages]);

  // Featured Packages for Banner
  const featuredPackages = useMemo(() => {
      return allPackages.filter(p => p.isFeatured);
  }, [allPackages]);

  // --- Handlers ---

  const handleWatchAd = () => {
    const reward = 5;
    setUserCoins(prev => prev + reward);
    setPopupConfig({ show: true, amount: reward, reason: 'Ad Reward' });
  };

  const handleActivateClick = (pkg: PackageData) => {
    const isCoinLocked = pkg.coinRequired !== false;
    
    if (isCoinLocked) {
        const cost = parseInt(pkg.price) * coinMultiplier;
        if (userCoins < cost) {
            alert(`Insufficient Coins! You need ${cost - userCoins} more coins. Watch ads or Invite friends.`);
            return;
        }
    }
    setSelectedPkg(pkg);
  };

  const handleConfirmActivation = (targetNumber: string) => {
    if (selectedPkg) {
      const isCoinLocked = selectedPkg.coinRequired !== false;
      const cost = isCoinLocked ? (parseInt(selectedPkg.price) * coinMultiplier) : 0;
      
      // Double check balance
      if (isCoinLocked && userCoins < cost) return;

      // Deduct Coins
      if (isCoinLocked) {
        setUserCoins(prev => prev - cost);
      }

      // Add to History
      const historyItem: HistoryItem = {
        package: selectedPkg,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        status: 'Pending',
        targetPhone: targetNumber
      };
      setHistory(prev => [historyItem, ...prev]);

      setSelectedPkg(null);
      setActiveTab('History');
    }
  };

  // Admin Handlers
  const handleAddPackage = (pkg: PackageData) => {
    setAllPackages(prev => [pkg, ...prev]);
  };

  const handleUpdatePackage = (updatedPkg: PackageData) => {
    setAllPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
  };

  const handleDeletePackage = (id: string) => {
    setAllPackages(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateStatus = (timestamp: number, newStatus: 'Approved' | 'Rejected') => {
    setHistory(prev => prev.map(item => 
        item.timestamp === timestamp ? { ...item, status: newStatus } : item
    ));
  };

  // Video Handlers
  const handleAddVideo = (video: AdminVideo) => {
      setAdminVideos(prev => [video, ...prev]);
  };
  
  const handleDeleteVideo = (id: string) => {
      setAdminVideos(prev => prev.filter(v => v.id !== id));
  };

  const handleVideoWatched = (video: AdminVideo) => {
      // Add to History
      const historyItem: HistoryItem = {
          isVideo: true,
          video: video,
          date: new Date().toISOString(),
          timestamp: Date.now(),
          status: 'Watched'
      };
      setHistory(prev => [historyItem, ...prev]);
      setActiveTab('History');
      setShowNewsModal(false);
      // No Coin Reward for this
  };
  
  // Handle Like/Dislike
  const handleVideoReaction = (videoId: string, type: 'like' | 'dislike') => {
      setAdminVideos(prev => prev.map(v => {
          if (v.id === videoId) {
              const currentLikes = v.likes || 0;
              const currentDislikes = v.dislikes || 0;
              
              if (type === 'like') {
                  return { ...v, likes: currentLikes + 1 };
              } else {
                  return { ...v, dislikes: currentDislikes + 1 };
              }
          }
          return v;
      }));
  };

  // Promotion Handlers
  const handleAddPromotion = (promo: Promotion) => {
      setPromotions(prev => [promo, ...prev]);
  };

  const handleDeletePromotion = (id: string) => {
      setPromotions(prev => prev.filter(p => p.id !== id));
  };

  // Handle click on promotion slide
  const handlePromoClick = (packageId?: string) => {
      if (!packageId) return;
      const pkg = allPackages.find(p => p.id === packageId);
      if (pkg) {
          // Open details/confirmation modal directly
          handleActivateClick(pkg);
      } else {
          // Fallback: Just navigate to home if package not found (maybe deleted)
          setActiveTab('Home');
      }
  };

  // View Routing
  const renderContent = () => {
    if (isAdminMode) {
        return (
            <AdminPanel 
                packages={allPackages}
                onAddPackage={handleAddPackage}
                onUpdatePackage={handleUpdatePackage}
                onDeletePackage={handleDeletePackage}
                onBack={() => setIsAdminMode(false)}
                coinMultiplier={coinMultiplier}
                setCoinMultiplier={setCoinMultiplier}
                welcomeBonus={welcomeBonus}
                setWelcomeBonus={setWelcomeBonus}
                userRequests={history}
                onUpdateRequestStatus={handleUpdateStatus}
                adminVideos={adminVideos} // Admin sees ALL videos to manage them
                onAddVideo={handleAddVideo}
                onDeleteVideo={handleDeleteVideo}
                promotions={promotions} // Admin sees ALL promotions
                onAddPromotion={handleAddPromotion}
                onDeletePromotion={handleDeletePromotion}
            />
        );
    }

    switch (activeTab) {
        case 'History':
            return (
                <HistoryView 
                    history={history} 
                    showAds={!isAdminUser} 
                    activePromotions={activePromotions}
                    onPromoClick={handlePromoClick}
                />
            );
        
        case 'Profile':
            return (
                <ProfileView 
                    user={{...initialUser, coins: userCoins}} 
                    onOpenAdmin={() => setIsAdminMode(true)}
                    balance={userCoins.toString()} 
                    onLogout={onLogout}
                />
            );

        case 'Home':
        case 'Offers':
        default:
            return (
                <>
                    {/* Banner Slider */}
                    <BannerSlider featuredPackages={featuredPackages} showAds={!isAdminUser} />

                    {/* Search Bar */}
                    <div className="px-5 mb-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <i className="fas fa-search text-slate-400 group-focus-within:text-telenor transition-colors"></i>
                            </div>
                            <input
                              type="text"
                              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-100 text-slate-700 placeholder-slate-400 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-telenor/20 focus:border-telenor transition-all"
                              placeholder="Search for bundles..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="px-2">
                        <NetworkSelector currentNet={currentNet} onSelect={setCurrentNet} />
                    </div>

                    <div className="mt-4 px-1">
                        <TabFilter currentTab={currentTab} onSelect={setCurrentTab} />
                    </div>

                    {/* Dashboard Ad (Hidden for Admin) */}
                    {!isAdminUser && <DashboardAd />}

                    <div className="px-4 mt-2 mb-4">
                        <div className="flex justify-between items-center mb-4 mt-2">
                            <h3 className="font-bold text-slate-700 text-lg">
                                {currentTab === 'All' ? 'Available Packages' : `${currentTab} Offers`}
                            </h3>
                            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-md">
                                {filteredPackages.length} found
                            </span>
                        </div>
                        <PackageList 
                            packages={filteredPackages} 
                            userCoins={userCoins}
                            onActivate={handleActivateClick}
                            coinMultiplier={coinMultiplier}
                        />
                    </div>
                </>
            );
    }
  };

  return (
    // FIX: Main container is fixed height, scroll happens INSIDE the content area
    <div className="flex flex-col h-screen bg-bg-gray relative overflow-hidden">
      
      {/* Popunder Ad Component (Invisible logic) - Hidden for Admin */}
      {!isAdminUser && <PopunderAd />}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
          {/* Hide Header on Profile View to reduce clutter */}
          {!isAdminMode && activeTab !== 'Profile' && (
              <Header 
                userName={initialUser.name} 
                coins={userCoins} 
                onWatchAd={handleWatchAd}
                showAds={!isAdminUser}
                isAdmin={isAdminUser}                      // Pass prop
                onOpenAdmin={() => setIsAdminMode(true)}   // Pass handler
                onOpenNews={() => setShowNewsModal(true)}  // Open News
              />
          )}

          {renderContent()}
      </div>

      {/* Fixed Bottom Nav - Placed outside scroll container */}
      {!isAdminMode && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      
      {/* Modals */}
      <ConfirmationModal 
        pkg={selectedPkg} 
        onConfirm={handleConfirmActivation} 
        onCancel={() => setSelectedPkg(null)} 
        coinMultiplier={coinMultiplier}
      />

      {popupConfig.show && (
          <CoinPopup 
              amount={popupConfig.amount} 
              reason={popupConfig.reason} 
              onClose={() => setPopupConfig({ ...popupConfig, show: false })} 
          />
      )}

      {showNewsModal && (
          <NewsModal 
             videos={activeVideos} // Only pass active videos (24h)
             onClose={() => setShowNewsModal(false)}
             onVideoWatched={handleVideoWatched}
             onVideoReaction={handleVideoReaction}
          />
      )}
    </div>
  );
};

export default Dashboard;