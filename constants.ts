
import { QualityLevel } from './types';

export const COLORS = {
  BACKGROUND: '#0B1D3A',
  PRIMARY: '#2979FF',
  SUCCESS: '#00C896',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  CARD_BG: 'rgba(255, 255, 255, 0.05)',
};

export const THRESHOLDS = {
  EXCELLENT: 20,
  GOOD: 10,
  WEAK: 3,
};

export const EXPLANATIONS = {
  [QualityLevel.EXCELLENT]: "Your internet is very fast. Video calls and streaming will work perfectly.",
  [QualityLevel.GOOD]: "Your internet is stable and suitable for most online activities.",
  [QualityLevel.WEAK]: "Your internet is slow. Some apps and videos may load slowly.",
  [QualityLevel.VERY_WEAK]: "Your internet is very poor. Calls and browsing may not work properly.",
  [QualityLevel.OFFLINE]: "No internet connection detected. Please check your router or mobile data."
};

export const ANALYSIS_INTERVAL = 5; // Updated to 5 seconds as per request
