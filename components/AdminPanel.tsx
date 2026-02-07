import React, { useState, useMemo } from 'react';
import { PackageData, NetworkType, HistoryItem } from '../types';
import { NETWORKS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface AdminPanelProps {
  packages: PackageData[];
  onAddPackage: (pkg: PackageData) => void;
  onUpdatePackage: (pkg: PackageData) => void;
  onDeletePackage: (id: string) => void;
  onBack: () => void;
  coinMultiplier: number;
  setCoinMultiplier: (val: number) => void;
  welcomeBonus: number;
  setWelcomeBonus: (val: number) => void;
  userRequests: HistoryItem[];
  onUpdateRequestStatus: (timestamp: number, status: 'Approved' | 'Rejected') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    packages, 
    onAddPackage, 
    onUpdatePackage,
    onDeletePackage, 
    onBack, 
    coinMultiplier, 
    setCoinMultiplier,
    welcomeBonus,
    setWelcomeBonus,
    userRequests,
    onUpdateRequestStatus
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'requests' | 'settings'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  
  // Form State
  const [net, setNet] = useState<NetworkType>('telenor');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('Monthly');
  const [validity, setValidity] = useState('');
  const [coinRequired, setCoinRequired] = useState(true); 
  const [isFeatured, setIsFeatured] = useState(false); // New featured state
  
  // New Furniture Fields
  const [internet, setInternet] = useState('');
  const [onNet, setOnNet] = useState('');
  const [offNet, setOffNet] = useState('');
  const [sms, setSms] = useState('');

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);

  const resetForm = () => {
    setName(''); setPrice(''); setCode(''); setValidity('');
    setInternet(''); setOnNet(''); setOffNet(''); setSms('');
    setCoinRequired(true);
    setIsFeatured(false);
    setEditingPkgId(null);
  };

  const handleEditClick = (pkg: PackageData) => {
    setNet(pkg.net);
    setName(pkg.name);
    setPrice(pkg.price);
    setCode(pkg.code);
    setType(pkg.type);
    setValidity(pkg.validity || '');
    setInternet(pkg.internet || '');
    setOnNet(pkg.onNet || '');
    setOffNet(pkg.offNet || '');
    setSms(pkg.sms || '');
    setCoinRequired(pkg.coinRequired !== false);
    setIsFeatured(!!pkg.isFeatured);
    
    setEditingPkgId(pkg.id);
    setActiveTab('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !code) return;

    // Construct info string for backward compatibility
    const infoStr = `${internet} Data, ${onNet} On-Net, ${offNet} Off-Net`;

    const newPkg: PackageData = {
      id: editingPkgId || Date.now().toString(),
      net,
      name,
      price,
      info: infoStr,
      code,
      city: 'All', 
      type,
      validity: validity || undefined,
      internet: internet || '0 MB',
      onNet: onNet || '0',
      offNet: offNet || '0',
      sms: sms || '0',
      coinRequired: coinRequired,
      isFeatured: isFeatured
    };

    if (editingPkgId) {
        onUpdatePackage(newPkg);
        alert('Package Updated Successfully!');
    } else {
        onAddPackage(newPkg);
        alert('Package Added Successfully!');
    }
    
    resetForm();
    setActiveTab('list');
  };

  // --- AI BOT HANDLER ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!process.env.API_KEY) {
        alert("API Key is missing. Cannot use AI Bot.");
        return;
    }

    setIsAiLoading(true);

    try {
        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Data = reader.result as string;
            // Remove data:image/png;base64, prefix
            const base64Content = base64Data.split(',')[1];

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                Analyze this image of a mobile network package. 
                Extract the following details and return strictly valid JSON:
                {
                    "net": "one of 'telenor', 'jazz', 'zong', 'ufone'. If unknown, guess based on color or default to 'telenor'",
                    "name": "Name of package",
                    "price": "Just the number",
                    "code": "USSD code e.g. *123#",
                    "validity": "e.g. 7 Days, 30 Days",
                    "internet": "e.g. 10 GB",
                    "onNet": "On-net minutes",
                    "offNet": "Off-net minutes",
                    "sms": "SMS count"
                }
                If a field is not found, use empty string.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { mimeType: file.type, data: base64Content } },
                        { text: prompt }
                    ]
                }
            });

            const text = response.text;
            // Clean markdown json blocks if present
            const jsonStr = text?.replace(/```json/g, '').replace(/```/g, '').trim();
            
            if (jsonStr) {
                const data = JSON.parse(jsonStr);
                
                // Auto-fill form
                if (data.net) setNet(data.net.toLowerCase() as NetworkType);
                if (data.name) setName(data.name);
                if (data.price) setPrice(data.price.toString());
                if (data.code) setCode(data.code);
                if (data.validity) setValidity(data.validity);
                if (data.internet) setInternet(data.internet);
                if (data.onNet) setOnNet(data.onNet.toString());
                if (data.offNet) setOffNet(data.offNet.toString());
                if (data.sms) setSms(data.sms.toString());

                alert("AI extracted details! Please review the form.");
            }
        };
    } catch (error) {
        console.error("AI Error:", error);
        alert("AI Bot failed to read the image. Please try again or enter manually.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
        const search = searchTerm.toLowerCase();
        return (
            pkg.name.toLowerCase().includes(search) ||
            pkg.code.toLowerCase().includes(search) ||
            pkg.net.toLowerCase().includes(search) ||
            pkg.price.includes(search)
        );
    });
  }, [packages, searchTerm]);

  // Filter for Requests
  const filteredRequests = useMemo(() => {
    let result = userRequests;
    if (requestSearchTerm.trim()) {
        const q = requestSearchTerm.toLowerCase();
        result = result.filter(req => 
            req.package.name.toLowerCase().includes(q) ||
            req.targetPhone.includes(q) ||
            req.status.toLowerCase().includes(q) ||
            req.package.price.includes(q)
        );
    }
    // Sort: Pending first, then newest
    return result.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return b.timestamp - a.timestamp;
    });
  }, [userRequests, requestSearchTerm]);

  const pendingRequestsCount = userRequests.filter(req => req.status === 'Pending').length;

  return (
    <div className="bg-slate-900 min-h-screen pb-24 animate-fade-in absolute inset-0 z-50 overflow-y-auto">
      {/* Admin Header */}
      <div className="bg-slate-800 text-white p-6 pt-10 sticky top-0 z-10 shadow-xl border-b border-slate-700">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors">
                    <i className="fas fa-arrow-left text-white"></i>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Admin Console</h2>
                    <p className="text-xs text-slate-400">Manage Packages & Settings</p>
                </div>
            </div>
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50 text-red-500">
                <i className="fas fa-lock"></i>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-950/50 rounded-xl border border-slate-700 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('list')}
                className={`flex-1 min-w-[80px] py-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${activeTab === 'list' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <i className="fas fa-list text-sm"></i> List
            </button>
            <button 
                onClick={() => { resetForm(); setActiveTab('add'); }}
                className={`flex-1 min-w-[80px] py-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${activeTab === 'add' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <i className={`fas ${editingPkgId ? 'fa-pencil-alt' : 'fa-plus'} text-sm`}></i> {editingPkgId ? 'Edit' : 'Add'}
            </button>
            <button 
                onClick={() => setActiveTab('requests')}
                className={`flex-1 min-w-[80px] py-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 relative ${activeTab === 'requests' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                {pendingRequestsCount > 0 && (
                    <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
                <i className="fas fa-envelope-open-text text-sm"></i> Req
            </button>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`flex-1 min-w-[80px] py-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${activeTab === 'settings' ? 'bg-yellow-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <i className="fas fa-cog text-sm"></i> Set
            </button>
        </div>
      </div>

      <div className="p-4">
          {activeTab === 'requests' && (
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <i className="fas fa-inbox text-purple-500"></i> User Requests
                     </h3>
                     <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-lg border border-slate-700">
                        {filteredRequests.length} Items
                     </span>
                  </div>

                  {/* Search for Requests */}
                  <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-search text-slate-500"></i>
                        </div>
                        <input 
                            type="text" 
                            value={requestSearchTerm}
                            onChange={(e) => setRequestSearchTerm(e.target.value)}
                            placeholder="Search requests (phone, package, status)..." 
                            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-slate-500 text-sm"
                        />
                  </div>
                  
                  {filteredRequests.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                          <i className="fas fa-search text-3xl mb-3 opacity-50 block"></i>
                          <p>No matching requests found.</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                        {filteredRequests.map((req, idx) => (
                            <div key={idx} className={`bg-slate-800 p-4 rounded-2xl border ${req.status === 'Pending' ? 'border-purple-500/50 shadow-purple-500/10' : 'border-slate-700'} shadow-lg transition-all hover:border-slate-600`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-sm" style={{ backgroundColor: NETWORKS.find(n => n.id === req.package.net)?.color || '#555' }}>
                                            {req.package.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{req.package.name}</h4>
                                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                                <i className="fas fa-phone-alt text-[10px]"></i>
                                                {req.targetPhone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${
                                        req.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                        req.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {req.status}
                                    </div>
                                </div>
                                
                                <div className="bg-slate-900/50 rounded-xl p-3 mb-3 flex justify-between items-center border border-slate-700/50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Price</span>
                                        <span className="text-white font-bold text-sm">{req.package.price} Rs</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Date</span>
                                        <span className="text-slate-300 text-xs">{new Date(req.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {req.status === 'Pending' && (
                                    <div className="flex gap-2 mt-2">
                                        <button 
                                            onClick={() => onUpdateRequestStatus(req.timestamp, 'Rejected')}
                                            className="flex-1 py-2.5 bg-slate-700 hover:bg-red-900/50 hover:text-red-200 text-slate-300 rounded-xl text-xs font-bold transition-all"
                                        >
                                            Reject
                                        </button>
                                        <button 
                                            onClick={() => onUpdateRequestStatus(req.timestamp, 'Approved')}
                                            className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                                        >
                                            <i className="fas fa-check"></i> Approve
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'settings' && (
              <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fas fa-coins text-yellow-500"></i> Coin Configuration
                  </h3>
                  
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-4">
                      <label className="text-sm text-slate-300 font-bold uppercase block mb-4">
                          Coin Cost Multiplier (Current: {coinMultiplier}x)
                      </label>
                      <p className="text-xs text-slate-400 mb-4">
                          This controls how many coins equal 1 Rupee. E.g., if set to 20, a Rs 100 package costs 2000 Coins.
                      </p>
                      
                      <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={coinMultiplier} 
                            onChange={(e) => setCoinMultiplier(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="w-16 h-12 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                              {coinMultiplier}
                          </div>
                      </div>
                  </div>

                  {/* Welcome Bonus Settings */}
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                      <label className="text-sm text-slate-300 font-bold uppercase block mb-4">
                          New User Welcome Bonus (Current: {welcomeBonus} Coins)
                      </label>
                      <p className="text-xs text-slate-400 mb-4">
                          Coins given to a new user immediately upon registration.
                      </p>
                      
                      <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="0" 
                            max="500" 
                            step="5"
                            value={welcomeBonus} 
                            onChange={(e) => setWelcomeBonus(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="w-16 h-12 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                              {welcomeBonus}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'add' && (
            <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <i className={`fas ${editingPkgId ? 'fa-pencil-alt' : 'fa-plus-circle'} text-blue-500`}></i> 
                    {editingPkgId ? 'Edit Package' : 'Add New Package'}
                </h3>
                
                {editingPkgId && (
                     <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-3 rounded-xl mb-4 text-xs flex items-center gap-2">
                         <i className="fas fa-info-circle"></i>
                         Editing existing package. ID: {editingPkgId}
                     </div>
                )}

                {/* AI Bot Section (Hidden if editing) */}
                {!editingPkgId && (
                    <div className="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 p-4 rounded-xl border border-indigo-500/30 mb-6 relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                                <i className="fas fa-robot text-white"></i>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">AI Auto-Fill Bot</h4>
                                <p className="text-[10px] text-indigo-200">Upload screenshot to auto-fill details</p>
                            </div>
                        </div>
                        
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="block w-full text-xs text-slate-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-xs file:font-semibold
                            file:bg-indigo-600 file:text-white
                            hover:file:bg-indigo-700
                            cursor-pointer"
                            disabled={isAiLoading}
                        />

                        {isAiLoading && (
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                                <div className="text-center">
                                    <i className="fas fa-circle-notch fa-spin text-indigo-400 text-2xl mb-2"></i>
                                    <p className="text-indigo-200 text-xs font-bold">Scanning Image...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Network Selection */}
                    <div>
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Network Provider</label>
                        <div className="flex gap-2">
                            {NETWORKS.map(n => (
                                <button
                                    key={n.id}
                                    type="button"
                                    onClick={() => setNet(n.id)}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all ${net === n.id ? 'border-white text-white scale-105 shadow-lg' : 'border-slate-700 text-slate-500 bg-slate-900'}`}
                                    style={{ backgroundColor: net === n.id ? n.color : undefined, borderColor: net === n.id ? n.color : undefined }}
                                >
                                    {n.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-blue-500 focus:outline-none" placeholder="e.g. Super Card" required />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Price (Rs)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-blue-500 focus:outline-none" placeholder="850" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Code</label>
                            <input value={code} onChange={e => setCode(e.target.value)} className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-blue-500 focus:outline-none" placeholder="*123#" required />
                        </div>
                         <div>
                            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Validity</label>
                            <input value={validity} onChange={e => setValidity(e.target.value)} className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-blue-500 focus:outline-none" placeholder="30 Days" />
                        </div>
                    </div>

                    {/* Ad/Coin Control & Promotion Toggle */}
                    <div className="flex gap-4">
                        <div className="flex-1 bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                            <div>
                                <label className="text-xs text-white font-bold uppercase block">Require Coins</label>
                                <p className="text-[10px] text-slate-500">Lock with coins</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={coinRequired} onChange={e => setCoinRequired(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>

                        <div className="flex-1 bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                            <div>
                                <label className="text-xs text-white font-bold uppercase block">Promote Banner</label>
                                <p className="text-[10px] text-slate-500">Show in Home Slider</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                            </label>
                        </div>
                    </div>

                    {/* Furniture Grid Inputs */}
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <label className="text-xs text-slate-300 font-bold uppercase block mb-3">Resources (Furniture)</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase block mb-1">Internet</label>
                                <input value={internet} onChange={e => setInternet(e.target.value)} className="w-full p-2 bg-slate-800 rounded-lg border border-slate-600 text-white text-sm" placeholder="2 GB" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase block mb-1">On-Net Mins</label>
                                <input value={onNet} onChange={e => setOnNet(e.target.value)} className="w-full p-2 bg-slate-800 rounded-lg border border-slate-600 text-white text-sm" placeholder="1000" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase block mb-1">Off-Net Mins</label>
                                <input value={offNet} onChange={e => setOffNet(e.target.value)} className="w-full p-2 bg-slate-800 rounded-lg border border-slate-600 text-white text-sm" placeholder="100" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase block mb-1">SMS</label>
                                <input value={sms} onChange={e => setSms(e.target.value)} className="w-full p-2 bg-slate-800 rounded-lg border border-slate-600 text-white text-sm" placeholder="1000" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {editingPkgId && (
                            <button 
                                type="button" 
                                onClick={() => { resetForm(); setActiveTab('list'); }}
                                className="flex-1 py-4 bg-slate-700 text-white rounded-xl font-bold shadow-lg hover:bg-slate-600 transition-colors uppercase tracking-wide"
                            >
                                Cancel
                            </button>
                        )}
                        <button type="submit" className={`flex-1 py-4 text-white rounded-xl font-bold shadow-lg mt-0 active:scale-95 transition-transform uppercase tracking-wide ${editingPkgId ? 'bg-gradient-to-r from-green-600 to-green-500 shadow-green-900/50' : 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-900/50'}`}>
                            {editingPkgId ? 'Update Package' : 'Create Package'}
                        </button>
                    </div>
                </form>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative sticky top-0 z-10">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-search text-slate-500"></i>
                    </div>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search packages..." 
                        className="w-full pl-11 pr-4 py-4 bg-slate-800 border border-slate-700 text-white rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
                    />
                </div>

                <div className="flex items-center justify-between text-slate-400 text-xs px-2">
                    <span>Showing {filteredPackages.length} packages</span>
                    <span>Total: {packages.length}</span>
                </div>

                <div className="space-y-3">
                    {filteredPackages.map(pkg => (
                        <div key={pkg.id} className="bg-slate-800 p-4 rounded-2xl shadow-md flex justify-between items-center border border-slate-700 group hover:border-slate-600 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm" style={{ backgroundColor: NETWORKS.find(n => n.id === pkg.net)?.color }}>
                                    {pkg.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-base text-white">
                                        {pkg.name}
                                        {pkg.isFeatured && <i className="fas fa-star text-yellow-400 ml-2 text-xs" title="Featured"></i>}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                        <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-300 font-mono">{pkg.price} Rs</span>
                                        {pkg.coinRequired === false ? (
                                            <span className="bg-blue-900/50 px-2 py-0.5 rounded text-blue-400 text-[10px] font-bold">FREE</span>
                                        ) : (
                                            <span className="bg-yellow-900/50 px-2 py-0.5 rounded text-yellow-400 text-[10px] font-bold">COINS</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEditClick(pkg)}
                                    className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all border border-blue-500/30"
                                    title="Edit Package"
                                >
                                    <i className="fas fa-pencil-alt text-sm"></i>
                                </button>
                                <button 
                                    onClick={() => {
                                        if(confirm(`Are you sure you want to PERMANENTLY DELETE ${pkg.name}?`)) onDeletePackage(pkg.id);
                                    }}
                                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all border border-red-500/30"
                                    title="Delete Package"
                                >
                                    <i className="fas fa-trash-alt text-sm"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {filteredPackages.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            <i className="fas fa-search text-4xl mb-3 opacity-50"></i>
                            <p>No packages found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdminPanel;