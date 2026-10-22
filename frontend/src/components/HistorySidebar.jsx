import React from 'react';
import { History, Trash2, ChevronRight, CheckCircle2, XCircle, HelpCircle, X } from 'lucide-react';

const HistorySidebar = ({ isOpen, onClose, history = [], onSelectClaim, onDeleteClaim, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-deep-900 border-l border-deep-750 shadow-2xl flex flex-col backdrop-blur-2xl">
      {/* Drawer Header */}
      <div className="p-4 border-b border-deep-750 flex items-center justify-between bg-deep-950/80">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-tan-400" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">
            Verification History ({history.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-deep-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-xs text-slate-400">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-tan-400 border-t-transparent mr-2"></div>
            Loading audit records...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-xl bg-deep-800/80 border border-deep-700 flex items-center justify-center mx-auto mb-3 text-slate-500">
              <History className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No Audits Recorded</p>
            <p className="text-xs text-slate-500 mt-1">
              Claims you verify will be permanently saved to your audit ledger.
            </p>
          </div>
        ) : (
          history.map((item) => {
            const vLower = (item.verdict || '').toLowerCase();
            const isAuthentic = vLower.includes('true') || vLower.includes('verified') || vLower.includes('authentic');
            const isFalse = vLower.includes('false') || vLower.includes('debunked') || vLower.includes('wrong') || (item.confidenceScore < 30);

            const BadgeIcon = isAuthentic ? CheckCircle2 : isFalse ? XCircle : HelpCircle;
            const badgeColor = isAuthentic
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : isFalse
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

            return (
              <div
                key={item._id || item.id || Math.random()}
                className="group relative p-3.5 rounded-xl bg-deep-850/80 hover:bg-deep-800 border border-deep-750 hover:border-tan-400/40 transition-all cursor-pointer"
                onClick={() => onSelectClaim(item)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{item.verdict}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {item.confidenceScore}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClaim(item._id || item.id);
                      }}
                      title="Delete Record"
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-tan-400 transition-colors" />
                  </div>
                </div>

                <p className="mt-2 text-xs font-medium text-slate-200 line-clamp-2 leading-snug">
                  {item.claimText || item.claim}
                </p>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                  <span>
                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </span>
                  <span>{item.matchedArticles?.length || 0} Sources</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
