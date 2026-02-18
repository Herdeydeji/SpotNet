
export enum QualityLevel {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  WEAK = 'Weak',
  VERY_WEAK = 'Very Weak',
  OFFLINE = 'Offline'
}

export interface NetworkStats {
  downloadSpeed: number; // in Mbps
  latency: number; // in ms
  connectionType: string;
  quality: QualityLevel;
  explanation: string;
  timestamp: number;
  isOnline: boolean;
}

export interface NetworkInformation extends EventTarget {
  readonly effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
  onchange: EventListener;
}
