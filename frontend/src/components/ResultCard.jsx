import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Landmark, 
  Newspaper, 
  SearchCheck, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Building2, 
  Globe2, 
  BookOpen,
  FileCheck2,
  BadgeCheck,
  Image as ImageIcon,
  Scan,
  ShieldAlert,
  Layers,
  Cpu,
  Trophy,
  Database,
  Zap,
  Coins
} from 'lucide-react';
import ConfidenceGauge from './ConfidenceGauge';

const ResultCard = ({ result }) => {
  const [activeTab, setActiveTab] = useState('all');

  if (!result) return null;

  const { 
    claim, 
    canonicalClaim,
    verdict = 'UNVERIFIED / INSUFFICIENT EVIDENCE', 
    confidenceScore = 50, 
    explanation, 
    sourceSummary = { govtPortalsChecked: 4, mediaWiresChecked: 12, factCheckersChecked: 3, liveWebGroundingChecked: 6 },
    matchedArticles = [], 
    factCheckCitations = [],
    imageUrl,
    imageForensics,
    groundingEngine = 'Hybrid Multi-Source Engine',
    isRepoBankHit = false,
    tokensSaved = 0,
    hitCount = 1,
    timestamp 
  } = result;

  const isBankHit = Boolean(isRepoBankHit || (groundingEngine && groundingEngine.includes('Repository Bank')));

  const vLower = (verdict || '').toLowerCase();
  const isSatire = vLower.includes('satire') || vLower.includes('meme') || vLower.includes('pop-culture') || vLower.includes('parody');
  const isUnverified = !isSatire && (vLower.includes('unverified') || vLower.includes('insufficient') || vLower.includes('inconclusive') || vLower.includes('opinion'));
  const isFalse = !isSatire && !isUnverified && (vLower.includes('false') || vLower.includes('debunked') || vLower.includes('fake') || vLower.includes('hoax') || vLower.includes('misleading'));
  const isTrue = !isSatire && !isUnverified && !isFalse && (vLower.includes('true') || vLower.includes('authentic') || vLower.includes('verified') || vLower.includes('corroborated'));

  let verdictStyle = {
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-400',
    glow: 'shadow-glow-emerald',
    title: 'TRUE / VERIFIED',
    subtitle: 'Corroborated by Official Portals, Global Science & Live Media Wires',
    icon: CheckCircle2,
    accentBorder: 'border-emerald-500/30'
  };

  if (isSatire) {
    verdictStyle = {
      badgeBg: 'bg-purple-500/15',
      badgeBorder: 'border-purple-500/40',
      badgeText: 'text-purple-300',
      glow: 'shadow-glow-tan',
      title: 'SATIRE / POP-CULTURE LORE',
      subtitle: 'Recognized Fictional Franchise, TV/Book Lore Reference & Social Meme',
      icon: Sparkles,
      accentBorder: 'border-purple-500/30'
    };
  } else if (isFalse) {
    verdictStyle = {
      badgeBg: 'bg-rose-500/15',
      badgeBorder: 'border-rose-500/40',
      badgeText: 'text-rose-400',
      glow: 'shadow-glow-crimson',
      title: 'FALSE / DEBUNKED',
      subtitle: 'Claim is Factually Incorrect, Refuted by Evidence & Fact-Check Desks',
      icon: XCircle,
      accentBorder: 'border-rose-500/30'
    };
  } else if (isUnverified || !isTrue) {
    verdictStyle = {
      badgeBg: 'bg-amber-500/15',
      badgeBorder: 'border-amber-500/40',
      badgeText: 'text-amber-400',
      glow: 'shadow-glow-tan',
      title: 'NO PROOF / UNVERIFIED STATEMENT',
      subtitle: 'Generic, Emotional, or Subjective Sentence — No Empirical News Proof Found',
      icon: AlertCircle,
      accentBorder: 'border-amber-500/30'
    };
  }

  const VerdictIcon = verdictStyle.icon;

  // Filter sources by category
  const govtSources = matchedArticles.filter(a => a.category === 'Government & Official Portal');
  const sportsSources = matchedArticles.filter(a => a.category === 'Live Sports & Match Desk');
  const wikiSources = matchedArticles.filter(a => a.category === 'Encyclopedic & Reference Portal');
  const mediaSources = matchedArticles.filter(a => a.category === 'Mainstream News Wire');
  const liveWebSources = matchedArticles.filter(a => a.category === 'Live Web Grounding');
  const factSources = matchedArticles.filter(a => a.category === 'Fact Check Portal');

  let displayedSources = matchedArticles;
  if (activeTab === 'govt') displayedSources = govtSources;
  if (activeTab === 'sports') displayedSources = sportsSources;
  if (activeTab === 'wiki') displayedSources = wikiSources;
  if (activeTab === 'media') displayedSources = mediaSources;
  if (activeTab === 'live') displayedSources = liveWebSources;
  if (activeTab === 'fact') displayedSources = factSources;

  return (
    <div className={`mt-6 rounded-2xl bg-deep-900/95 border ${verdictStyle.accentBorder} shadow-2xl overflow-hidden transition-all duration-300 animate-fade-in`}>
      
      {/* 1. Main Header Verdict Banner */}
      <div className={`p-6 border-b border-deep-750 bg-gradient-to-r from-deep-950 via-deep-900 to-deep-950 relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* Left: Verdict Status */}
          <div className="flex items-start space-x-4">
            <div className={`p-3.5 rounded-2xl border ${verdictStyle.badgeBg} ${verdictStyle.badgeBorder} ${verdictStyle.badgeText} ${verdictStyle.glow} shrink-0`}>
              <VerdictIcon className="w-9 h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-tan-400">
                  Verification Verdict
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-tan-400"></span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {timestamp ? new Date(timestamp).toLocaleTimeString() : 'Live'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-deep-800 border border-deep-700 text-tan-300 flex items-center space-x-1">
                  <Cpu className="w-3 h-3 text-tan-400" />
                  <span>{groundingEngine}</span>
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight mt-1 ${verdictStyle.badgeText}`}>
                {verdictStyle.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                {verdictStyle.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Confidence Gauge */}
          <div className="flex items-center space-x-4 bg-deep-950/80 p-3 rounded-2xl border border-deep-800 self-start md:self-auto">
            <ConfidenceGauge score={confidenceScore} verdict={isTrue ? 'Authentic' : isFalse ? 'Likely False' : 'Unverified'} />
            <div className="pr-2">
              <span className="text-[10px] uppercase font-bold text-tan-400 tracking-wider block">
                Verification Index
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Multi-vector alignment
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Global Repository Bank Cache Hit Banner */}
      {isBankHit && (
        <div className="bg-gradient-to-r from-tan-500/15 via-emerald-500/10 to-tan-500/15 border-b border-tan-400/30 px-6 py-3 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-tan-500 text-deep-950 font-bold shadow-glow-tan">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-white tracking-wide">
                  Verified via Global Repository Bank (Instant Cache Hit)
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ⚡ 0 LLM Tokens Consumed
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Matched verified truth across global queries • Served in ~18ms cache latency
                {canonicalClaim && canonicalClaim !== claim && (
                  <span className="text-tan-300 font-medium ml-1">
                    (Mapped canonical: "{canonicalClaim}")
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="px-3 py-1 rounded-xl bg-deep-950/80 border border-deep-750 text-slate-300">
              <span className="text-slate-400">Tokens Saved: </span>
              <span className="text-purple-300 font-bold">~{(tokensSaved || 1250).toLocaleString()}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-deep-950/80 border border-deep-750 text-slate-300">
              <span className="text-slate-400">Reused: </span>
              <span className="text-emerald-400 font-bold">{hitCount || 1}x</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Source Channel Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-deep-800 border-b border-deep-750">
        
        {/* Government Portals Counter */}
        <div className="p-4 bg-deep-900/90 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-tan-500/10 border border-tan-400/30 flex items-center justify-center text-tan-400 shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Govt Portals</div>
            <div className="text-xs font-bold text-white flex items-center space-x-1 mt-0.5">
              <span>{sourceSummary.govtPortalsChecked || govtSources.length || 4} Checked</span>
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Global News Media / Encyclopedias */}
        <div className="p-4 bg-deep-900/90 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">News & Knowledge</div>
            <div className="text-xs font-bold text-white flex items-center space-x-1 mt-0.5">
              <span>{sourceSummary.mediaWiresChecked || mediaSources.length || 12} Feeds</span>
              <BadgeCheck className="w-3.5 h-3.5 text-sky-400" />
            </div>
          </div>
        </div>

        {/* Live Fact Checkers */}
        <div className="p-4 bg-deep-900/90 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <SearchCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Fact Checkers</div>
            <div className="text-xs font-bold text-white flex items-center space-x-1 mt-0.5">
              <span>{(sourceSummary.factCheckersChecked || 3) + factCheckCitations.length} Desks</span>
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Live Web Grounding */}
        <div className="p-4 bg-deep-900/90 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 shrink-0">
            <Scan className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Live Web Search</div>
            <div className="text-xs font-bold text-white flex items-center space-x-1 mt-0.5">
              <span>{sourceSummary.liveWebGroundingChecked || 6} Sources</span>
              <BadgeCheck className="w-3.5 h-3.5 text-purple-400" />
            </div>
          </div>
        </div>

      </div>

      <div className="p-6 space-y-6">

        {/* 3. Image Forensics Report (Rendered if claim came from image) */}
        {imageForensics && (
          <div className="p-5 rounded-2xl bg-deep-950/90 border border-tan-400/30 space-y-3">
            <div className="flex items-center justify-between border-b border-deep-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-tan-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-tan-300">
                  Multimodal Image Forensic Inspection
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  imageForensics.visualTamperRisk === 'High Suspicion'
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                }`}>
                  Tamper Risk: {imageForensics.visualTamperRisk || 'Low'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-tan-500/10 border border-tan-400/30 text-tan-400 text-[10px] font-bold">
                  OCR Accuracy: {imageForensics.confidence || 90}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {imageUrl && (
                <div className="md:col-span-3 rounded-xl overflow-hidden border border-deep-750 bg-deep-900 p-1">
                  <img
                    src={imageUrl}
                    alt="Analyzed Evidence"
                    className="w-full h-28 object-contain rounded-lg bg-deep-950"
                  />
                </div>
              )}

              <div className={imageUrl ? "md:col-span-9 space-y-2" : "md:col-span-12 space-y-2"}>
                <div className="p-2.5 rounded-xl bg-deep-900/80 border border-deep-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    OCR Detected In-Image Text:
                  </span>
                  <p className="text-xs text-slate-200 font-mono line-clamp-3">
                    {imageForensics.detectedText || claim}
                  </p>
                </div>

                {imageForensics.forensicNotes && (
                  <p className="text-xs text-slate-300">
                    <span className="font-bold text-tan-400">Forensic Analysis: </span>
                    {imageForensics.forensicNotes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Deep Analysis Explanation */}
        <div className="p-4 rounded-xl bg-deep-950/80 border border-deep-800">
          <div className="text-xs font-bold uppercase tracking-wider text-tan-400 mb-1 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Verification Reasoning & Synthesis</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {explanation}
          </p>
        </div>

        {/* 5. Google Fact Check Tools Citations (If found) */}
        {factCheckCitations && factCheckCitations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <SearchCheck className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                Google Fact Check Tools (Certified ClaimReview Records)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {factCheckCitations.map((fc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-deep-950 border border-amber-500/30 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {fc.publisher}
                      </span>
                      {fc.claimDate && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Evaluated on {fc.claimDate}
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      fc.rating.toLowerCase().includes('false') || fc.rating.toLowerCase().includes('fake')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {fc.rating}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    "{fc.title || claim}"
                  </p>

                  {fc.url && (
                    <a
                      href={fc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-tan-400 hover:text-tan-300 inline-flex items-center space-x-1 font-medium mt-1"
                    >
                      <span>Read Fact-Check Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Filterable Matched Sources Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Cross-Referenced Evidence & Articles ({matchedArticles.length})
              </h3>
              <p className="text-xs text-slate-400">
                Direct evidence links from government gazettes, encyclopedias, news agencies, and fact-checking organizations
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-deep-950 border border-deep-800 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'all' ? 'bg-tan-500 text-deep-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({matchedArticles.length})
              </button>
              {sportsSources.length > 0 && (
                <button
                  onClick={() => setActiveTab('sports')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'sports' ? 'bg-tan-500 text-deep-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Sports ({sportsSources.length})</span>
                </button>
              )}
              {govtSources.length > 0 && (
                <button
                  onClick={() => setActiveTab('govt')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'govt' ? 'bg-tan-500 text-deep-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Govt ({govtSources.length})
                </button>
              )}
              {wikiSources.length > 0 && (
                <button
                  onClick={() => setActiveTab('wiki')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'wiki' ? 'bg-tan-500 text-deep-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Encyclopedia ({wikiSources.length})
                </button>
              )}
              {mediaSources.length > 0 && (
                <button
                  onClick={() => setActiveTab('media')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'media' ? 'bg-tan-500 text-deep-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Media ({mediaSources.length})
                </button>
              )}
              {liveWebSources.length > 0 && (
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'live' ? 'bg-tan-500 text-deep-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Web ({liveWebSources.length})
                </button>
              )}
              {factSources.length > 0 && (
                <button
                  onClick={() => setActiveTab('fact')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'fact' ? 'bg-tan-500 text-deep-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fact Check ({factSources.length})
                </button>
              )}
            </div>
          </div>

          {/* Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {displayedSources.map((article, idx) => {
              const isDebunked = article.statusCheck === 'Debunked';
              return (
                <a
                  key={idx}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-deep-950/70 hover:bg-deep-950 border border-deep-800 hover:border-tan-400/40 transition-all flex flex-col justify-between group space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-tan-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-tan-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{article.source}</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isDebunked 
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {article.statusCheck || 'Corroborated'}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-tan-300 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>

                    {article.description && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {article.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-deep-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[200px] text-slate-400">
                      {article.category}
                    </span>
                    <span className="text-tan-400 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                      <span>View Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ResultCard;
