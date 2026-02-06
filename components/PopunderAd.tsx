import React, { useEffect } from 'react';

const PopunderAd: React.FC = () => {
  useEffect(() => {
    const KEY = 'easyselect_popunder_last_shown';
    const now = Date.now();
    const lastShown = localStorage.getItem(KEY);
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // Check if 24 hours have passed or if it's the first time
    if (!lastShown || now - parseInt(lastShown) > ONE_DAY_MS) {
      const script = document.createElement('script');
      script.src = "https://pl28618164.effectivegatecpm.com/2c/64/9c/2c649c5d7837ff939d15029853a1f0e2.js";
      script.async = true;
      document.body.appendChild(script);
      
      localStorage.setItem(KEY, now.toString());
      console.log('Popunder ad script injected');
    } else {
        console.log('Popunder ad skipped (shown within last 24h)');
    }
  }, []);

  return null;
};

export default PopunderAd;