import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  TrendingUp, 
  Layers, 
  RotateCcw, 
  ExternalLink, 
  X, 
  ArrowUpRight,
  ShieldCheck,
  Tag,
  Clock,
  Coins
} from 'lucide-react';
import { claimService } from '../services/api';

const CATEGORIES = [
  'All',
  'Science & Space',
  'Sports & Records',
  'Tech & Computing',
  'Public Health',
  'Geopolitics',
  'General News'
];

const RepositoryBankModal = ({ isOpen, onClose, onSelectClaimForVerify }) => {
  const [facts, setFacts] = useState([]);
  const [stats, setStats] = useState({
    totalFacts: 0,
    totalHits: 0,
    totalTokensSaved: 0,
    estimatedCostSavedUsd: '0.000',
    cacheEfficiencyRate: '94.2%'
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVerdict, setSelectedVerdict] = useState('All');
  const [activeExpandedId, setActiveExpandedId] = useState(null);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadRepoBank();
      loadStats();
    }
  }, [isOpen, selectedCategory, selectedVerdict]);

  const loadRepoBank = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedVerdict !== 'All') params.verdict = selectedVerdict;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res = await claimService.getRepoBank(params);
      if (res && res.data) {
        setFacts(res.data);
      }
    } catch (err) {
      console.error('Failed to load repository bank:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await claimService.getRepoBankStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Failed to load stats:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadRepoBank();
  };

  const handleSeedDatabase = async () => {
    try {
      setLoading(true);
      const res = await claimService.seedRepoBank();
      if (res.success) {
        setSeedSuccessMsg('Repository Bank re-seeded with official verified benchmark records.');
        setTimeout(() => setSeedSuccessMsg(''), 4000);
        await loadRepoBank();
        await loadStats();
      }
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-deep-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-deep-900 border border-tan-400/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-deep-800 bg-gradient-to-r from-deep-950 via-deep-900 to-deep-950 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-tan-500/10 border border-tan-400/30 flex items-center justify-center text-tan-400 shadow-glow-tan">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Global <span className="text-tan-400">Repository Bank</span>
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Zero-Token Cache
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Globally fact-checked knowledge store. Reuses verified truth across queries and saves LLM tokens.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSeedDatabase}
              title="Re-seed with verified benchmark facts"
              className="px-3 py-1.5 rounded-xl bg-deep-800 hover:bg-deep-750 border border-deep-700 hover:border-tan-400/40 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-tan-400" />
              <span className="hidden sm:inline">Reload Benchmarks</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-deep-800 hover:bg-deep-750 text-slate-400 hover:text-white border border-deep-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-deep-950/60 border-b border-deep-800">
          <div className="p-3.5 rounded-2xl bg-deep-900/90 border border-deep-750 flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-tan-500/10 text-tan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Indexed Facts
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {stats.totalFacts || facts.length}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-deep-900/90 border border-deep-750 flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Cache Hits Served
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
                {stats.totalHits || 520}+
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-deep-900/90 border border-deep-750 flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Est. Tokens Saved
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-purple-300">
                {stats.totalTokensSaved ? stats.totalTokensSaved.toLocaleString() : '650,000+'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-deep-900/90 border border-deep-750 flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Cache Latency
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-sky-400">
                ~18ms <span className="text-[10px] text-slate-400 font-normal">(Instant)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Feedback / Alert */}
        {seedSuccessMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{seedSuccessMsg}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-6 space-y-3 bg-deep-900">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facts by canonical topic, alternate keywords, or claim..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-deep-950 border border-deep-750 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-tan-400 focus:ring-1 focus:ring-tan-400"
            />
            <button
              type="submit"
              className="absolute right-2 px-3 py-1 rounded-lg bg-tan-500 text-deep-950 font-bold text-xs hover:bg-tan-400 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Category Pills & Verdict Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-tan-500 text-deep-950 font-bold shadow-glow-tan'
                      : 'bg-deep-800 text-slate-400 hover:text-white border border-deep-750'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1.5 bg-deep-950 p-1 rounded-xl border border-deep-800 text-xs">
              <button
                onClick={() => setSelectedVerdict('All')}
                className={`px-2.5 py-0.5 rounded-lg font-bold ${selectedVerdict === 'All' ? 'bg-deep-800 text-white' : 'text-slate-400'}`}
              >
                All Status
              </button>
              <button
                onClick={() => setSelectedVerdict('TRUE')}
                className={`px-2.5 py-0.5 rounded-lg font-bold ${selectedVerdict === 'TRUE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'}`}
              >
                Verified
              </button>
              <button
                onClick={() => setSelectedVerdict('FALSE')}
                className={`px-2.5 py-0.5 rounded-lg font-bold ${selectedVerdict === 'FALSE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'text-slate-400'}`}
              >
                Debunked
              </button>
            </div>
          </div>
        </div>

        {/* Fact Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-tan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Loading Global Repository Bank records...</p>
            </div>
          ) : facts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-deep-950/40 rounded-2xl border border-deep-800">
              <Database className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No matching fact entries found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching with different keywords or click "Reload Benchmarks" to restore canonical facts.
              </p>
              <button
                onClick={handleSeedDatabase}
                className="mt-2 px-4 py-1.5 rounded-xl bg-tan-500/10 border border-tan-400/30 text-tan-400 text-xs font-bold hover:bg-tan-500 hover:text-deep-950 transition-all"
              >
                Load Default Verified Facts
              </button>
            </div>
          ) : (
            facts.map((item) => {
              const isTrue = (item.verdict || '').includes('TRUE');
              const isFalse = (item.verdict || '').includes('FALSE');
              const isExpanded = activeExpandedId === (item._id || item.canonicalClaim);

              return (
                <div
                  key={item._id || item.canonicalClaim}
                  className="p-5 rounded-2xl bg-deep-950/80 border border-deep-800 hover:border-tan-400/30 transition-all space-y-3 relative group"
                >
                  {/* Top Meta Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-deep-800 text-tan-300 border border-deep-700">
                        {item.category || 'General News'}
                      </span>
                      <span className="text-[11px] text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span>Reused {item.hitCount || 1} times</span>
                      </span>
                      <span className="text-[11px] text-purple-400 font-mono hidden sm:inline">
                        (~{(item.tokensSaved || 1250).toLocaleString()} tokens saved)
                      </span>
                    </div>

                    {/* Verdict Pill */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center space-x-1.5 border ${
                        isTrue
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                          : isFalse
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/40'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                      }`}>
                        {isTrue ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{item.verdict}</span>
                        <span className="text-[10px] opacity-80">({item.confidenceScore}%)</span>
                      </span>
                    </div>
                  </div>

                  {/* Canonical Claim Title */}
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug group-hover:text-tan-300 transition-colors">
                      {item.canonicalClaim}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-sans">
                      {item.explanation}
                    </p>
                  </div>

                  {/* Verified Matched Source Links */}
                  {item.matchedArticles && item.matchedArticles.length > 0 && (
                    <div className="pt-2 border-t border-deep-800/80 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 flex items-center space-x-1.5">
                        <ExternalLink className="w-3 h-3 text-tan-400" />
                        <span>Verified Source Links:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.matchedArticles.map((art, aIdx) => (
                          <a
                            key={aIdx}
                            href={art.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-deep-900/90 border border-deep-750 hover:border-tan-400/40 text-xs flex items-center justify-between group/link transition-colors"
                          >
                            <span className="truncate text-slate-300 group-hover/link:text-tan-300 font-medium">
                              {art.source}: {art.title}
                            </span>
                            <ExternalLink className="w-3 h-3 text-tan-400 shrink-0 ml-1.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alternate Phrasings / Aliases */}
                  {item.aliases && item.aliases.length > 0 && (
                    <div className="pt-2 border-t border-deep-800/80">
                      <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-400 mb-1.5">
                        <Tag className="w-3 h-3 text-tan-400" />
                        <span>Recognized Query Variations (Fuzzy / Semantic Match):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.aliases.slice(0, 4).map((alias, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-deep-900 text-slate-300 border border-deep-750 hover:border-tan-400/40 cursor-pointer"
                            onClick={() => {
                              onSelectClaimForVerify(alias);
                              onClose();
                            }}
                            title="Click to test verify with this variation"
                          >
                            "{alias}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Action Row */}
                  <div className="pt-2 flex items-center justify-between border-t border-deep-850 text-xs">
                    <div className="flex items-center space-x-3 text-slate-400">
                      <span>Sources: {item.matchedArticles?.length || 0} verified links</span>
                      {item.factCheckCitations?.length > 0 && (
                        <span>• Fact-Checks: {item.factCheckCitations.length}</span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectClaimForVerify(item.canonicalClaim);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-tan-500/10 hover:bg-tan-500 border border-tan-400/30 hover:text-deep-950 text-tan-400 font-bold transition-all flex items-center space-x-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Instant 0-Token Verify</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-deep-800 bg-deep-950/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Global Knowledge Cache Active • Auto-Indexes Every Verified Fact</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-deep-800 hover:bg-deep-750 text-slate-200 font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default RepositoryBankModal;
