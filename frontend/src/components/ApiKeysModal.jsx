import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Save, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  Search,
  Globe2
} from 'lucide-react';
import { claimService } from '../services/api';

const ApiKeysModal = ({ isOpen, onClose, onKeysUpdated }) => {
  const [engineStatus, setEngineStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  // Key inputs
  const [geminiKey, setGeminiKey] = useState('');
  const [factCheckKey, setFactCheckKey] = useState('');
  const [serperKey, setSerperKey] = useState('');
  const [newsApiKey, setNewsApiKey] = useState('');

  // Visibility toggles
  const [showGemini, setShowGemini] = useState(false);
  const [showFactCheck, setShowFactCheck] = useState(false);
  const [showSerper, setShowSerper] = useState(false);
  const [showNewsApi, setShowNewsApi] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await claimService.getEngineStatus();
      if (res.success && res.data) {
        setEngineStatus(res.data);
      }
    } catch (err) {
      console.warn('Could not load engine status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKeys = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    try {
      const res = await claimService.updateApiKeys({
        geminiApiKey: geminiKey || undefined,
        factCheckApiKey: factCheckKey || undefined,
        serperApiKey: serperKey || undefined,
        newsApiKey: newsApiKey || undefined
      });

      if (res.success) {
        setSaveStatus('Saved successfully!');
        loadStatus();
        if (onKeysUpdated) onKeysUpdated();
        setTimeout(() => {
          setSaveStatus('');
        }, 2500);
      } else {
        setSaveStatus('Failed to update keys');
      }
    } catch (err) {
      setSaveStatus('Error connecting to backend');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-950/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-2xl rounded-2xl bg-deep-900 border border-tan-400/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-deep-750 flex items-center justify-between bg-deep-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-tan-500/10 border border-tan-400/30 flex items-center justify-center text-tan-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Live Fact-Checking & Vision API Keys
              </h3>
              <p className="text-xs text-slate-400">
                Configure live external data providers for real-time verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-deep-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Active Status Overview */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-tan-400 block mb-2.5">
              Live Provider Integration Status:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              <div className="p-2.5 rounded-xl bg-deep-950 border border-deep-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Gemini Vision</span>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className={`w-2 h-2 rounded-full ${engineStatus?.gemini?.configured ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'}`}></span>
                  <span className={`text-xs font-bold ${engineStatus?.gemini?.configured ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {engineStatus?.gemini?.configured ? 'Active' : 'Fallback'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-deep-950 border border-deep-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Google FactCheck</span>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className={`w-2 h-2 rounded-full ${engineStatus?.factCheck?.configured ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'}`}></span>
                  <span className={`text-xs font-bold ${engineStatus?.factCheck?.configured ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {engineStatus?.factCheck?.configured ? 'Active' : 'Fallback'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-deep-950 border border-deep-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Live Web Search</span>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className={`w-2 h-2 rounded-full ${engineStatus?.liveWeb?.configured ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'}`}></span>
                  <span className={`text-xs font-bold ${engineStatus?.liveWeb?.configured ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {engineStatus?.liveWeb?.configured ? 'Active' : 'Fallback'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-deep-950 border border-deep-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 font-medium">NewsAPI Wires</span>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className={`w-2 h-2 rounded-full ${engineStatus?.newsApi?.configured ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'}`}></span>
                  <span className={`text-xs font-bold ${engineStatus?.newsApi?.configured ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {engineStatus?.newsApi?.configured ? 'Active' : 'Fallback'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <form onSubmit={handleSaveKeys} className="space-y-4">
            
            {/* 1. Google Gemini Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-tan-400" />
                  <span>Google Gemini API Key (Vision OCR & AI Grounding)</span>
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-tan-400 hover:text-tan-300 inline-flex items-center space-x-1 text-[11px]"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showGemini ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-deep-950 border border-deep-750 focus:border-tan-400 focus:ring-1 focus:ring-tan-400 text-xs text-slate-100 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowGemini(!showGemini)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2. Google Fact Check Tools API Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Fact Check Tools API Key</span>
                </label>
                <a
                  href="https://toolbox.google.com/factcheck/apis"
                  target="_blank"
                  rel="noreferrer"
                  className="text-tan-400 hover:text-tan-300 inline-flex items-center space-x-1 text-[11px]"
                >
                  <span>Google FactCheck API</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showFactCheck ? 'text' : 'password'}
                  value={factCheckKey}
                  onChange={(e) => setFactCheckKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-deep-950 border border-deep-750 focus:border-tan-400 focus:ring-1 focus:ring-tan-400 text-xs text-slate-100 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowFactCheck(!showFactCheck)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showFactCheck ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3. Serper / Tavily Live Search Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Live Search API Key (Serper.dev or Tavily)</span>
                </label>
                <a
                  href="https://serper.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="text-tan-400 hover:text-tan-300 inline-flex items-center space-x-1 text-[11px]"
                >
                  <span>Get 2,500 Free Queries</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showSerper ? 'text' : 'password'}
                  value={serperKey}
                  onChange={(e) => setSerperKey(e.target.value)}
                  placeholder="serper_api_key_here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-deep-950 border border-deep-750 focus:border-tan-400 focus:ring-1 focus:ring-tan-400 text-xs text-slate-100 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSerper(!showSerper)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showSerper ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 4. NewsAPI Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5 text-emerald-400" />
                  <span>NewsAPI.org API Key (Mainstream News Feeds)</span>
                </label>
                <a
                  href="https://newsapi.org"
                  target="_blank"
                  rel="noreferrer"
                  className="text-tan-400 hover:text-tan-300 inline-flex items-center space-x-1 text-[11px]"
                >
                  <span>NewsAPI Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showNewsApi ? 'text' : 'password'}
                  value={newsApiKey}
                  onChange={(e) => setNewsApiKey(e.target.value)}
                  placeholder="newsapi_key_here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-deep-950 border border-deep-750 focus:border-tan-400 focus:ring-1 focus:ring-tan-400 text-xs text-slate-100 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewsApi(!showNewsApi)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showNewsApi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Save Button Row */}
            <div className="pt-3 flex items-center justify-between border-t border-deep-750">
              <span className="text-xs font-bold text-emerald-400">
                {saveStatus}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-deep-800 hover:bg-deep-750 text-xs font-semibold text-slate-300"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-tan-500 to-tan-400 hover:from-tan-400 hover:to-tan-300 text-deep-950 font-extrabold text-xs tracking-wide shadow-glow-tan transition-all flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Keys & Connect</span>
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default ApiKeysModal;
