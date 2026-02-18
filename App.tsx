
import React, { useState, useEffect, useCallback } from 'react';
import { getNetworkAnalysis } from './services/networkService';
import { NetworkStats, QualityLevel } from './types';
import { COLORS, ANALYSIS_INTERVAL } from './constants';
import NetworkCard from './components/NetworkCard';

const App: React.FC = () => {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ANALYSIS_INTERVAL);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const results = await getNetworkAnalysis();
      setStats(results);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
      setTimeLeft(ANALYSIS_INTERVAL);
    }
  }, []);

  // Sync online status with browser events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial analysis
  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown and Auto-refresh logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          runAnalysis();
          return ANALYSIS_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [runAnalysis]);

  const getQualityColor = (quality: QualityLevel) => {
    switch (quality) {
      case QualityLevel.EXCELLENT: return COLORS.SUCCESS;
      case QualityLevel.GOOD: return COLORS.PRIMARY;
      case QualityLevel.WEAK: return COLORS.WARNING;
      case QualityLevel.VERY_WEAK: return COLORS.DANGER;
      case QualityLevel.OFFLINE: return COLORS.DANGER;
      default: return COLORS.PRIMARY;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-2">
            SPOTNET <span className="text-[#2979FF]">NAIJA</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Telecom-Grade Network Diagnostic Tool</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className="flex items-center gap-2">
            <div className={`pulse-dot ${!isOnline ? 'bg-red-500' : ''}`} style={!isOnline ? { background: COLORS.DANGER } : {}} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
              {isOnline ? 'Auto Monitoring Active' : 'Offline Mode'}
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-xs font-mono text-[#2979FF]">
            NEXT: {timeLeft}s
          </div>
        </div>
      </header>

      {!isOnline && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-semibold text-sm">No Internet Connection. Monitoring will resume automatically.</span>
        </div>
      )}

      {/* Main Grid */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NetworkCard
          title="Network Quality"
          value={stats?.quality || 'Analyzing...'}
          explanation={stats?.explanation || 'Estimating your current internet stability and speed capacity.'}
          accentColor={stats ? getQualityColor(stats.quality) : COLORS.PRIMARY}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />

        <NetworkCard
          title="Download Speed"
          value={stats?.downloadSpeed || 0}
          unit="Mbps"
          explanation="Measures how fast you can receive data from the web using a 100KB packet."
          accentColor={COLORS.PRIMARY}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        />

        <NetworkCard
          title="Latency (Ping)"
          value={stats?.latency || 0}
          unit="ms"
          explanation="Network responsiveness. Lower values mean smoother real-time interactions."
          accentColor={COLORS.SUCCESS}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <NetworkCard
          title="Connection Type"
          value={stats?.connectionType || '---'}
          explanation="Detected link technology provided by your device's operating system."
          accentColor="#9333EA"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M2.93 7.636a15 15 0 0121.213 0" />
            </svg>
          }
        />
      </main>

      {/* Footer / Meta info */}
      <footer className="mt-auto py-10 flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs gap-4 border-t border-white/5">
        <div className="flex flex-col gap-1">
          <p>© 2024 SpotNet Naija. All rights reserved.</p>
          <p>Optimized for low-bandwidth mobile environments.</p>
        </div>
        
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Last Update: {stats ? new Date(stats.timestamp).toLocaleTimeString() : 'Waiting...'}</span>
          </div>
          {isAnalyzing && (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing Network...</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
