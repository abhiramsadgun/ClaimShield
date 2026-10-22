import React from 'react';
import { ShieldCheck, LogOut, User, Sparkles, Activity, History, KeyRound, Database } from 'lucide-react';
import { authService } from '../services/api';

const Navbar = ({ 
  user, 
  onToggleHistory, 
  isHistoryOpen, 
  historyCount = 0, 
  onOpenApiKeys,
  onOpenRepoBank 
}) => {
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-deep-750/80 bg-deep-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-deep-800 to-deep-700 border border-tan-400/30 flex items-center justify-center shadow-glow-tan">
            <ShieldCheck className="w-6 h-6 text-tan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Claim<span className="text-tan-400">Shield</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tan-500/10 text-tan-400 border border-tan-400/20 uppercase tracking-wider">
                Multimodal AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Real-Time Fact Checking & Image Forensics
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Repository Bank Button */}
          <button
            onClick={onOpenRepoBank}
            title="Explore Global Fact Repository Bank & 0-Token Knowledge Store"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-deep-900 to-deep-850 hover:from-tan-500/20 hover:to-deep-800 border border-tan-400/40 text-xs font-bold text-tan-400 hover:text-white transition-all shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-tan-400" />
            <span>Repository Bank</span>
          </button>

          {/* API Keys Configuration Button */}
          <button
            onClick={onOpenApiKeys}
            title="Configure Live Fact-Check & Gemini Vision API Keys"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-deep-900 hover:bg-deep-850 border border-deep-750 hover:border-tan-400/40 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <KeyRound className="w-3.5 h-3.5 text-tan-400" />
            <span className="hidden sm:inline">Live APIs</span>
          </button>

          {/* Microservice Live Status Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-deep-900 border border-deep-750 text-xs font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Grounding Engine:</span>
            <span className="text-emerald-400 font-semibold">Live</span>
          </div>

          {/* Toggle History Button */}
          <button
            onClick={onToggleHistory}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isHistoryOpen
                ? 'bg-tan-500 text-deep-950 border-tan-400 shadow-glow-tan'
                : 'bg-deep-850 text-slate-300 border-deep-750 hover:border-tan-400/40 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audits</span>
            {historyCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isHistoryOpen ? 'bg-deep-950 text-tan-400' : 'bg-deep-750 text-slate-200'
              }`}>
                {historyCount}
              </span>
            )}
          </button>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-deep-750">
            <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-deep-900/90 border border-deep-800 text-xs">
              <div className="w-6 h-6 rounded-md bg-deep-800 border border-deep-750 flex items-center justify-center text-tan-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden lg:inline text-slate-200 font-semibold font-mono">
                {user?.username || 'Analyst'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg bg-deep-900/90 border border-deep-800 text-slate-400 hover:text-crimson hover:border-red-500/30 hover:bg-red-950/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
