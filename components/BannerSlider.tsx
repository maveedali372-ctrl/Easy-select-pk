import React, { useState, useEffect } from 'react';
import { PackageData } from '../types';
import { NETWORKS } from '../constants';

interface BannerSliderProps {
    featuredPackages?: PackageData[];
}

const DEFAULT_BANNERS = [
  { id: 'def1', color: 'from-purple-600 to-indigo-600', title: 'Invite Friends', subtitle: 'Earn 100 Coins per invite!', icon: 'fa-users', netId: null },
  { id: 'def2', color: 'from-blue-500 to-cyan-500', title: 'Telenor Special', subtitle: 'Get 200GB Data Monthly', icon: 'fa-bolt', netId: 'telenor' },
  { id: 'def3', color: 'from-orange-500 to-red-500', title: 'Watch Ads', subtitle: 'Free Coins Every Hour', icon: 'fa-play-circle', netId: null },
];

const BannerSlider: React.FC<BannerSliderProps> = ({ featuredPackages = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine default banners with featured packages
  const slides = React.useMemo(() => {
      // If we have featured packages, use them. If not, fallback or mix.
      // Let's mix them: Featured first, then defaults.
      
      const featuredSlides = featuredPackages.map(pkg => {
          const net = NETWORKS.find(n => n.id === pkg.net);
          
          // Determine gradient based on network
          let gradient = 'from-gray-500 to-gray-700';
          if (pkg.net === 'jazz') gradient = 'from-red-600 to-orange-600';
          if (pkg.net === 'telenor') gradient = 'from-blue-500 to-cyan-500';
          if (pkg.net === 'zong') gradient = 'from-lime-600 to-green-600';
          if (pkg.net === 'ufone') gradient = 'from-orange-500 to-amber-600';

          return {
              id: pkg.id,
              color: gradient,
              title: pkg.name,
              subtitle: `${pkg.internet || pkg.info.split(',')[0]} • ${pkg.price} PKR`,
              icon: 'fa-star',
              netId: pkg.net
          };
      });

      // If no featured packages, return defaults
      if (featuredSlides.length === 0) return DEFAULT_BANNERS;

      // Return combined (max 5 slides total to avoid clutter)
      return [...featuredSlides, ...DEFAULT_BANNERS].slice(0, 5);
  }, [featuredPackages]);

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="px-5 mb-2 relative z-0">
        <div className="overflow-hidden rounded-2xl shadow-lg border border-white/50 relative h-36 group bg-white">
            <div 
                className="flex transition-transform duration-700 ease-in-out h-full" 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((banner) => (
                    <div 
                        key={banner.id} 
                        className={`w-full flex-shrink-0 bg-gradient-to-r ${banner.color} p-5 flex items-center justify-between text-white relative overflow-hidden`}
                    >
                        {/* Decorative Circles */}
                        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
                        <div className="absolute bottom-[-20px] left-[-10px] w-20 h-20 bg-black opacity-10 rounded-full blur-lg"></div>

                        <div className="relative z-10 max-w-[70%]">
                            <span className="bg-white/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-2 inline-block backdrop-blur-sm border border-white/10">
                                {banner.netId ? `${banner.netId} Deal` : 'Featured'}
                            </span>
                            <h3 className="text-xl font-bold leading-tight mb-1 truncate">{banner.title}</h3>
                            <p className="text-xs opacity-90 font-medium mb-2 truncate">{banner.subtitle}</p>
                            <button className="bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-transform flex items-center gap-1">
                                Check It Out <i className="fas fa-arrow-right text-[8px]"></i>
                            </button>
                        </div>
                        <div className="text-6xl opacity-20 transform rotate-12 group-hover:scale-110 transition-transform duration-700 absolute right-4 bottom-[-10px]">
                            <i className={`fas ${banner.icon}`}></i>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {slides.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`}
                    ></div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default BannerSlider;