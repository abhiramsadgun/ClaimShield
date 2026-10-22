import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Send, 
  RotateCcw, 
  AlertCircle, 
  FileSearch,
  Landmark,
  Newspaper,
  SearchCheck,
  Image as ImageIcon,
  FileText,
  KeyRound,
  Globe2,
  TrendingUp,
  Database,
  Zap,
  Coins,
  Link2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ResultCard from '../components/ResultCard';
import HistorySidebar from '../components/HistorySidebar';
import ImageDropzone from '../components/ImageDropzone';
import ApiKeysModal from '../components/ApiKeysModal';
import RepositoryBankModal from '../components/RepositoryBankModal';
import { claimService, authService } from '../services/api';

const SCAN_STEPS = [
  { text: 'Extracting named entities & keywords in real-time...', icon: Sparkles },
  { text: 'Querying Google Fact Check Tools ClaimReview registry...', icon: SearchCheck },
  { text: 'Scanning live web search & official government portals...', icon: Landmark },
  { text: 'Ingesting live NewsAPI wires & Wikipedia knowledge base...', icon: Newspaper },
  { text: 'Synthesizing live facts & determining corroboration index...', icon: ShieldCheck }
];

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeInputMode, setActiveInputMode] = useState('text'); // 'text' | 'image'
  const [claimText, setClaimText] = useState('');
  const [currentResult, setCurrentResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [currentScanStep, setCurrentScanStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isApiKeysOpen, setIsApiKeysOpen] = useState(false);
  const [isRepoBankOpen, setIsRepoBankOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const resultsRef = useRef(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setCurrentUser(user);
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await claimService.getHistory();
      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.warn('Could not load history:', err.message);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleAudit = async (customPayload) => {
    const payload = customPayload || { text: claimText.trim() };
    const textToVerify = typeof payload === 'string' ? payload : payload.text;

    if (!textToVerify || !textToVerify.trim() || isAuditing) return;

    setErrorMsg('');
    setIsAuditing(true);
    setCurrentResult(null);
    setCurrentScanStep(0);

    // Step simulation for visual feedback
    const stepInterval = setInterval(() => {
      setCurrentScanStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 650);

    try {
      const response = await claimService.verify(payload);
      clearInterval(stepInterval);
      if (response.success && response.data) {
        setCurrentResult(response.data);
        loadHistory();
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      } else {
        setErrorMsg('Verification completed with an unexpected format.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      const msg = err.response?.data?.message || 'Verification failed. Ensure FastAPI (port 8000) and Express (port 5000) are running.';
      setErrorMsg(msg);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleImageExtractedVerify = (imageData) => {
    setClaimText(imageData.text);
    handleAudit({
      text: imageData.text,
      imageUrl: imageData.imageUrl,
      extractedFromImage: true,
      imageForensics: imageData.imageForensics
    });
  };

  const handleSelectHistoryItem = (item) => {
    setCurrentResult({
      claim: item.claimText || item.claim,
      verdict: item.verdict,
      confidenceScore: item.confidenceScore,
      explanation: item.explanation,
      sourceSummary: item.sourceSummary || { govtPortalsChecked: 4, mediaWiresChecked: 12, factCheckersChecked: 3, liveWebGroundingChecked: 6 },
      matchedArticles: item.matchedArticles || [],
      factCheckCitations: item.factCheckCitations || [],
      imageUrl: item.imageUrl,
      imageForensics: item.imageForensics,
      groundingEngine: item.groundingEngine || 'Real-Time Multi-Source Engine',
      timestamp: item.timestamp
    });
    setClaimText(item.claimText || item.claim);
    setIsHistoryOpen(false);
  };

  const handleDeleteHistoryItem = async (id) => {
    try {
      await claimService.deleteHistoryItem(id);
      setHistory(prev => prev.filter(h => (h._id || h.id) !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleClear = () => {
    setClaimText('');
    setCurrentResult(null);
    setErrorMsg('');
  };

  const CurrentScanIcon = SCAN_STEPS[currentScanStep].icon;

  return (
    <div className="min-h-screen bg-deep-950 text-slate-100 flex flex-col cyber-grid relative">
      
      {/* Navigation */}
      <Navbar
        user={currentUser}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        isHistoryOpen={isHistoryOpen}
        historyCount={history.length}
        onOpenApiKeys={() => setIsApiKeysOpen(true)}
        onOpenRepoBank={() => setIsRepoBankOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-tan-500/10 border border-tan-400/30 text-tan-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Real-Time Live Fact Verification Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Verify Live Claims & Viral Images Across <span className="text-tan-400">The Internet</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Real-time live multi-portal cross-referencing against Google Fact Check Tools, international news wires, government portals, live web search, and Gemini Vision.
          </p>

          {/* Repository Bank Global Knowledge Pill */}
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-2xl bg-deep-900/90 border border-tan-400/30 text-xs shadow-lg">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Global Repository Bank Active:</span>
            </span>
            <span className="text-slate-300">
              Instant 0-Token reuse across repeated news, varied text & images.
            </span>
            <button
              type="button"
              onClick={() => setIsRepoBankOpen(true)}
              className="text-tan-400 hover:text-white font-extrabold underline decoration-tan-400/50 hover:decoration-white transition-all flex items-center space-x-1"
            >
              <Database className="w-3 h-3" />
              <span>Explore Fact Bank</span>
            </button>
          </div>
        </div>

        {/* Input Card Container */}
        <div className="glass-panel-glow rounded-2xl p-6 border border-tan-400/20 shadow-2xl space-y-5">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-deep-800 pb-3">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveInputMode('text')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeInputMode === 'text'
                    ? 'bg-tan-500 text-deep-950 shadow-glow-tan'
                    : 'bg-deep-900 text-slate-400 hover:text-white border border-deep-750'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text / X Post / Web Links</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputMode('image')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeInputMode === 'image'
                    ? 'bg-tan-500 text-deep-950 shadow-glow-tan'
                    : 'bg-deep-900 text-slate-400 hover:text-white border border-deep-750'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image & Screenshot Forensics (OCR)</span>
              </button>
            </div>

            {claimText && activeInputMode === 'text' && (
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-tan-400 flex items-center space-x-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* TAB 1: Text Input Mode */}
          {activeInputMode === 'text' && (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  rows={4}
                  value={claimText}
                  onChange={(e) => setClaimText(e.target.value)}
                  placeholder="Paste any live statement, breaking news headline, X/Twitter link, Reddit thread, or news URL to verify in real-time..."
                  className="w-full p-4 rounded-xl bg-deep-950/90 border border-deep-750 focus:border-tan-400 focus:ring-1 focus:ring-tan-400 text-sm md:text-base text-slate-100 placeholder-slate-500 resize-none transition-all leading-relaxed font-sans"
                />
              </div>

              {/* Action Row */}
              <div className="pt-2 flex items-center justify-between border-t border-deep-750/70">
                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <SearchCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Google FactCheck</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Globe2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Live Web Grounding</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Newspaper className="w-3.5 h-3.5 text-sky-400" />
                    <span>Live News Wires</span>
                  </span>
                </div>

                <button
                  onClick={() => handleAudit()}
                  disabled={isAuditing || !claimText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-tan-500 to-tan-400 hover:from-tan-400 hover:to-tan-300 text-deep-950 font-extrabold text-sm tracking-wide shadow-glow-tan transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAuditing ? 'Searching Live Portals...' : 'Verify Live Claim'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Image Forensics Mode */}
          {activeInputMode === 'image' && (
            <ImageDropzone
              onExtractedClaim={handleImageExtractedVerify}
              isAuditing={isAuditing}
            />
          )}

        </div>

        {/* Live Multi-Portal Scanning Progress */}
        {isAuditing && (
          <div className="p-6 rounded-2xl bg-deep-900/90 border border-tan-400/30 shadow-glow-tan space-y-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-tan-400 border-t-transparent animate-spin"></div>
                <CurrentScanIcon className="w-4 h-4 text-tan-400 absolute inset-0 m-auto" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Real-Time Live Web & Portal Verification in Progress
                </h3>
                <p className="text-xs text-tan-300 font-medium">
                  {SCAN_STEPS[currentScanStep].text}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-deep-950 rounded-full h-2 overflow-hidden border border-deep-750">
              <div
                className="bg-gradient-to-r from-tan-500 via-amber-400 to-emerald-400 h-full transition-all duration-500 ease-out"
                style={{ width: `${((currentScanStep + 1) / SCAN_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <span className="font-bold block">Verification Pipeline Error</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* OUTPUT: Rendered Directly Below the Claim */}
        <div ref={resultsRef}>
          {currentResult && <ResultCard result={currentResult} />}
        </div>

      </main>

      {/* Audit History Drawer */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectClaim={handleSelectHistoryItem}
        onDeleteClaim={handleDeleteHistoryItem}
        isLoading={isHistoryLoading}
      />

      {/* API Keys Configuration Modal */}
      <ApiKeysModal
        isOpen={isApiKeysOpen}
        onClose={() => setIsApiKeysOpen(false)}
      />

      {/* Global Repository Bank Explorer Modal */}
      <RepositoryBankModal
        isOpen={isRepoBankOpen}
        onClose={() => setIsRepoBankOpen(false)}
        onSelectClaimForVerify={(text) => {
          setClaimText(text);
          handleAudit({ text });
        }}
      />

    </div>
  );
};

export default Dashboard;
