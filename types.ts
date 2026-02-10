
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

export interface AdminVideo {
  id: string;
  title: string;
  url: string;
  sourceType: 'embed' | 'upload'; // New field to distinguish source
  duration: number; // Required watch time in minutes
  timestamp: number;
  likes?: number;     // New: Like count
  dislikes?: number;  // New: Dislike count
}

export interface Promotion {
  id: string;
  imageUrl: string;
  timestamp: number;
  packageId?: string; // Optional link to a specific package
}

export interface HistoryItem {
  package?: PackageData; // Optional now
  video?: AdminVideo;    // New field for video logs
  isVideo?: boolean;     // Discriminator
  date: string; // ISO string
  timestamp: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Watched';
  targetPhone?: string;
}

export interface NetworkConfig {
  id: NetworkType;
  name: string;
  color: string;
  logo: string;
}