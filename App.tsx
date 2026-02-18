
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getNetworkAnalysis } from './services/networkService.ts';
import { NetworkStats, QualityLevel } from './types.ts';
import { COLORS, ANALYSIS_INTERVAL } from './constants.ts';
import NetworkCard from './components/NetworkCard.tsx';

const App: React.FC = () => {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [history, setHistory] = useState<NetworkStats[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ANALYSIS_INTERVAL);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const historyRef = useRef<HTMLDivElement>(null);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const results = await getNetworkAnalysis();
      setStats(results);
      setHistory(prev => [results, ...prev].slice(0, 15));
    } catch (error) {
      console.error("Diagnostic sequence failed", error);
    } finally {
      setIsAnalyzing(false);
      setTimeLeft(ANALYSIS_INTERVAL);
    }
  }, []);

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

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

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
    <div className="relative min-h-screen px-4 py-8 md:px-12 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Top Navbar */}
        <nav className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-black italic shadow-[0_0_20px_rgba(37,99,235,0.4)]">SN</div>
              <h1 className="text-2xl font-black tracking-[-0.05em] text-white">
                SPOTNET<span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">NAIJA</span>
              </h1>
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Diagnostic Command Center v2.1</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-5 py-3 border border-white/5 backdrop-blur-xl">
               <div className="relative h-2 w-2">
                 <div className={`h-full w-full rounded-full ${!isOnline ? 'bg-red-500' : 'bg-emerald-500'}`} />
                 {isOnline && <div className="absolute top-0 h-full w-full rounded-full bg-emerald-500 pulse-active" />}
               </div>
               <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                {isOnline ? 'Live Link' : 'No Signal'}
               </span>
               <div className="h-4 w-px bg-white/10 mx-2" />
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Next Probe</span>
                 <span className="font-mono text-sm font-bold text-blue-500">{timeLeft}s</span>
               </div>
            </div>
          </div>
        </nav>

        {!isOnline && (
          <div className="mb-8 animate-pulse rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center text-sm font-bold text-red-400">
            SIGNAL TERMINATED. CHECK CARRIER INTERFACE.
          </div>
        )}

        {/* Hero Section / Main Quality */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <NetworkCard
                  title="Link Performance"
                  value={isAnalyzing ? "Scanning..." : (stats?.quality || 'Initializing')}
                  explanation={stats?.explanation || 'Waiting for diagnostic payload to settle.'}
                  accentColor={stats ? getQualityColor(stats.quality) : COLORS.PRIMARY}
                  loading={isAnalyzing}
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  }
                />
                <NetworkCard
                  title="Effective Downlink"
                  value={isAnalyzing ? "..." : (stats?.downloadSpeed ?? 0)}
                  unit="Mbps"
                  explanation="Real-time throughput calculated via 100KB secure probe."
                  accentColor={COLORS.PRIMARY}
                  loading={isAnalyzing}
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  }
                />
                <NetworkCard
                  title="Interface Latency"
                  value={isAnalyzing ? "..." : (stats?.latency ?? 0)}
                  unit="ms"
                  explanation="Round-trip time to core DNS infrastructure."
                  accentColor={COLORS.SUCCESS}
                  loading={isAnalyzing}
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  }
                />
                <NetworkCard
                  title="Link Technology"
                  value={isAnalyzing ? "..." : (stats?.connectionType || 'Broadband')}
                  explanation="Detected cellular or terrestrial backbone type."
                  accentColor="#9333EA"
                  loading={isAnalyzing}
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0" /></svg>
                  }
                />
             </div>
          </div>

          {/* Activity Logs */}
          <div className="glass flex flex-col rounded-2xl p-6 border-white/10 h-full max-h-[460px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Activity Feed</h3>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar" ref={historyRef}>
              {history.length === 0 ? (
                <div className="py-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-600">No logs captured.</div>
              ) : (
                history.map((entry, i) => (
                  <div key={entry.timestamp} className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 border border-white/5 transition-all hover:bg-white/[0.05]">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-slate-500">{new Date(entry.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                      <span className="text-xs font-bold text-white">{entry.quality}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[10px] font-mono">
                      <span className="text-blue-400 font-black">{entry.downloadSpeed} Mbps</span>
                      <span className="text-slate-500">{entry.latency} ms</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="mt-12 border-t border-white/5 pt-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">Hardware Metrics</p>
                <div className="mt-2 flex gap-4">
                  <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-mono text-slate-400">RAM: STABLE</span>
                  <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-mono text-slate-400">CPU: OPTIMAL</span>
                  <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-mono text-slate-400">DATA: PROBE-MINIMIZED</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => runAnalysis()}
                  disabled={isAnalyzing}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-blue-600 px-6 py-3 font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 disabled:opacity-50"
                >
                  <span className="relative z-10 text-xs">{isAnalyzing ? 'Running Diagnostics' : 'Manual Probe'}</span>
                  {!isAnalyzing && <svg className="relative z-10 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                </button>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default App;
