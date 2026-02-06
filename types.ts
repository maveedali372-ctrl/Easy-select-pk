
export type NetworkType = 'telenor' | 'jazz' | 'zong' | 'ufone';

export interface UserProfile {
  name: string;
  phone: string;
  coins: number;
}

export interface PackageData {
  id: string;
  net: NetworkType;
  city: string;
  type: string; // e.g., 'Monthly', 'Weekly'
  name: string;
  info: string; // General description fallback
  price: string;
  code: string;
  validity?: string;
  dataDetails?: string;
  // New "Furniture" fields
  internet?: string;
  offNet?: string;
  onNet?: string;
  sms?: string;
  // Admin control for ads/coins
  coinRequired?: boolean;
  // Promotion
  isFeatured?: boolean;
}

export interface HistoryItem {
  package: PackageData;
  date: string; // ISO string
  timestamp: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  targetPhone: string;
}

export interface NetworkConfig {
  id: NetworkType;
  name: string;
  color: string;
  logo: string;
}
