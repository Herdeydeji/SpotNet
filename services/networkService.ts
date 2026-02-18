
import { NetworkStats, QualityLevel, NetworkInformation } from '../types.ts';
import { THRESHOLDS, EXPLANATIONS } from '../constants.ts';

/**
 * Measures latency by performing a lightweight fetch to a highly available endpoint.
 */
async function measureLatency(): Promise<number> {
  const start = performance.now();
  try {
    await fetch('https://www.google.com/generate_204', { mode: 'no-cors', method: 'HEAD', cache: 'no-store' });
    return Math.round(performance.now() - start);
  } catch (e) {
    return 0;
  }
}

/**
 * Measures download speed using a very small probe (~50KB-100KB) to minimize data consumption.
 */
async function measureDownloadSpeed(): Promise<number> {
  const start = performance.now();
  try {
    const response = await fetch('https://picsum.photos/400/400', { cache: 'no-store' });
    const blob = await response.blob();
    const end = performance.now();
    const durationSec = (end - start) / 1000;
    const sizeBits = blob.size * 8;
    const speedMbps = (sizeBits / durationSec) / 1_000_000;
    return parseFloat(speedMbps.toFixed(2));
  } catch (e) {
    const conn = (navigator as any).connection as NetworkInformation;
    return conn ? conn.downlink : 0;
  }
}

export const getNetworkAnalysis = async (): Promise<NetworkStats> => {
  const isOnline = navigator.onLine;
  
  if (!isOnline) {
    return {
      downloadSpeed: 0,
      latency: 0,
      connectionType: 'N/A',
      quality: QualityLevel.OFFLINE,
      explanation: EXPLANATIONS[QualityLevel.OFFLINE],
      timestamp: Date.now(),
      isOnline: false,
    };
  }

  const [latency, speed] = await Promise.all([
    measureLatency(),
    measureDownloadSpeed()
  ]);

  const conn = (navigator as any).connection as NetworkInformation;
  const connectionType = conn ? (conn.effectiveType || 'Broadband').toUpperCase() : 'WIFI/LAN';

  let quality = QualityLevel.VERY_WEAK;
  if (speed >= THRESHOLDS.EXCELLENT) quality = QualityLevel.EXCELLENT;
  else if (speed >= THRESHOLDS.GOOD) quality = QualityLevel.GOOD;
  else if (speed >= THRESHOLDS.WEAK) quality = QualityLevel.WEAK;

  return {
    downloadSpeed: speed,
    latency,
    connectionType,
    quality,
    explanation: EXPLANATIONS[quality],
    timestamp: Date.now(),
    isOnline: true,
  };
};
