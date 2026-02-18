
import { QualityLevel } from './types.ts';

export const COLORS = {
  BACKGROUND: '#020617',
  PRIMARY: '#3b82f6',    // Electric Blue
  SUCCESS: '#10b981',    // Emerald
  WARNING: '#f59e0b',    // Amber
  DANGER: '#ef4444',     // Crimson
  SLATE: '#1e293b',
};

export const THRESHOLDS = {
  EXCELLENT: 25, // Higher bars for "Excellent"
  GOOD: 12,
  WEAK: 5,
};

export const EXPLANATIONS = {
  [QualityLevel.EXCELLENT]: "Peak performance detected. Ultra-low latency suitable for 4K streaming and competitive gaming.",
  [QualityLevel.GOOD]: "Stable connection verified. Reliable for HD conferencing and standard enterprise workflows.",
  [QualityLevel.WEAK]: "Congestion or signal degradation detected. High-bandwidth applications may experience jitter.",
  [QualityLevel.VERY_WEAK]: "Critical link instability. Expect packet loss and frequent connection timeouts.",
  [QualityLevel.OFFLINE]: "Link terminated. Check hardware interface or carrier service status."
};

export const ANALYSIS_INTERVAL = 5; 
