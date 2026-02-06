import React from 'react';

const UsageStats: React.FC = () => {
  return (
    <div className="px-5 mb-6">
      <div className="flex justify-between items-end mb-3">
        <div>
            <h3 className="text-lg font-bold text-slate-800">Usage Remaining</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Last Updated 05/02/2026 11:46</p>
        </div>
        <button className="text-blue-500 text-xs font-bold hover:underline">View All Usage</button>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex justify-between gap-2">
        {/* Data */}
        <div className="flex-1 flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 mb-1">
                <i className="fas fa-wifi text-[10px] text-orange-500"></i>
                <span className="text-xs font-bold text-orange-500">Data</span>
            </div>
            <div className="text-lg font-bold text-slate-800 leading-none">5,995</div>
            <div className="text-[10px] text-slate-400 mb-2">MBs Left</div>
            
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: '80%' }}></div>
            </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-slate-100 h-16 self-center mx-1"></div>

        {/* Telenor Mins */}
        <div className="flex-1 flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 mb-1">
                <i className="fas fa-phone-alt text-[10px] text-yellow-500"></i>
                <span className="text-xs font-bold text-yellow-500">Telenor</span>
            </div>
            <div className="text-lg font-bold text-slate-800 leading-none">1,000</div>
            <div className="text-[10px] text-slate-400 mb-2">Mins Left</div>
            
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '90%' }}></div>
            </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-slate-100 h-16 self-center mx-1"></div>

        {/* Other Net */}
        <div className="flex-1 flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 mb-1">
                <i className="fas fa-phone text-[10px] text-pink-500"></i>
                <span className="text-xs font-bold text-pink-500">Other Net</span>
            </div>
            <div className="text-lg font-bold text-slate-800 leading-none">100</div>
            <div className="text-[10px] text-slate-400 mb-2">Mins Left</div>
            
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
        </div>
      </div>
      
      {/* Promo Banner */}
      <div className="mt-4 bg-[#f0fdf4] border border-green-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <div className="text-2xl">🎉</div>
            <div>
                <div className="text-xs font-medium text-slate-800">
                    Daily 2000MB in Rs 5 <span className="line-through text-slate-400 text-[10px]">Rs. 15</span>
                </div>
                <div className="text-[10px] text-slate-500">Validity: 1 Day</div>
            </div>
        </div>
        <button className="text-xs font-bold text-blue-500 hover:text-blue-600">Activate Now</button>
      </div>
    </div>
  );
};

export default UsageStats;
