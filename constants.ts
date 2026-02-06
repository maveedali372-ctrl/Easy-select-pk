import { NetworkConfig, PackageData } from './types';

// Network Configurations
export const NETWORKS: NetworkConfig[] = [
  { 
    id: 'telenor', 
    name: 'Telenor', 
    color: '#00A3E0', 
    logo: 'https://i.ibb.co/NdP4nhTT/download-5.png' 
  },
  { 
    id: 'jazz', 
    name: 'Jazz', 
    color: '#ed1c24', 
    logo: 'https://i.ibb.co/gbr6zf8H/images-13.png' 
  },
  { 
    id: 'zong', 
    name: 'Zong', 
    color: '#8cc34a', 
    logo: 'https://i.ibb.co/bg29hky2/images-2026-02-05-T132252-579.jpg' 
  },
  { 
    id: 'ufone', 
    name: 'Ufone', 
    color: '#f36f21', 
    logo: 'https://i.ibb.co/mCzkLrH1/images-2026-02-06-T020840-870.jpg' 
  }
];

// Real Database of Packages extracted from images
export const PACKAGES: PackageData[] = [
  // --- UFONE PACKAGES ---
  { id: 'u1', net: 'ufone', city: 'All', type: 'Monthly', name: 'Super 5', info: '200GB, 20k Ufone, 2k Other', price: '3499', code: '*964#', validity: '30 Days', internet: '200 GB', onNet: '20000', offNet: '2000', sms: '20000' },
  { id: 'u2', net: 'ufone', city: 'All', type: 'Monthly', name: 'Digital Plus Offer', info: '200GB, 10k Ufone, 2k Other', price: '2500', code: '*977#', validity: '30 Days', internet: '200 GB', onNet: '10000', offNet: '2000', sms: '10000' },
  { id: 'u5', net: 'ufone', city: 'All', type: 'Monthly', name: 'Super Card Gold', info: '80GB, 6000 Ufone, 600 Other', price: '1799', code: '*900#', validity: '30 Days', internet: '80 GB', onNet: '6000', offNet: '600', sms: '6000' },
  { id: 'u6', net: 'ufone', city: 'All', type: 'Monthly', name: 'Super Card Premium', info: '50GB, 6000 Ufone, 500 Other', price: '1699', code: '*900#', validity: '30 Days', internet: '50 GB', onNet: '6000', offNet: '500', sms: '6000' },
  { id: 'u11', net: 'ufone', city: 'All', type: 'Weekly', name: 'Weekly Grand Offer', info: '100GB, 7000 Ufone, 600 Other', price: '530', code: '*7777*1#', validity: '7 Days', internet: '100 GB', onNet: '7000', offNet: '600', sms: '7000' },

  // --- JAZZ PACKAGES ---
  { id: 'j1', net: 'jazz', city: 'All', type: 'Monthly', name: 'Monthly X Plus', info: '200GB, 5000 Jazz, 1500 Other', price: '2600', code: '*872#', validity: '30 Days', internet: '200 GB', onNet: '5000', offNet: '1500', sms: '5000' },
  { id: 'j2', net: 'jazz', city: 'All', type: 'Monthly', name: 'Monthly FreeDom', info: '100GB, 3000 Jazz, 750 Other', price: '2500', code: '*733#', validity: '30 Days', internet: '100 GB', onNet: '3000', offNet: '750', sms: '3000' },
  { id: 'j8', net: 'jazz', city: 'All', type: 'Weekly', name: 'Weekly X Plus', info: '100GB, 5000 Jazz, 600 Other', price: '700', code: '*852#', validity: '7 Days', internet: '100 GB', onNet: '5000', offNet: '600', sms: '5000' },
  
  // --- ZONG PACKAGES ---
  { id: 'z1', net: 'zong', city: 'All', type: '90 Day', name: 'Quattro Pro Max', info: '200GB, 20k Zong, 2k Other', price: '5000', code: '*964#', validity: '90 Days', internet: '200 GB', onNet: '20000', offNet: '2000', sms: '20000' },
  { id: 'z3', net: 'zong', city: 'All', type: 'Monthly', name: 'Pro Max Plus', info: '200GB, 20k Zong, 2k Other', price: '2200', code: 'Retailer', validity: '30 Days', internet: '200 GB', onNet: '20000', offNet: '2000', sms: '20000' },
  { id: 'z5', net: 'zong', city: 'All', type: 'Weekly', name: 'Weekly Azadi', info: '60GB, 6000 Zong, 600 Other', price: '580', code: 'Retailer', validity: '7 Days', internet: '60 GB', onNet: '6000', offNet: '600', sms: '6000' },

  // --- TELENOR PACKAGES ---
  { id: 't1', net: 'telenor', city: 'All', type: 'Monthly', name: 'EasyCard 1600', info: '200GB, Unlim Telenor, 1200 Other', price: '1600', code: '*964*1*3*1#', validity: '30 Days', internet: '200 GB', onNet: 'Unlim', offNet: '1200', sms: '5000' },
  { id: 't7', net: 'telenor', city: 'All', type: 'Weekly', name: 'EasyCard 350', info: '80GB, 500 Other Min', price: '350', code: '*964*1*2*1#', validity: '7 Days', internet: '80 GB', onNet: '5000', offNet: '500', sms: '5000' },
];

export const TABS = ['All', 'Monthly', 'Weekly', 'Daily', '90 Day', '15 Day', 'Lahore', 'Karachi'];

export const PLACEHOLDER_AVATAR = "https://picsum.photos/100/100";