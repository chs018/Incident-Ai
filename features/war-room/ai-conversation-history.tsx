'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Clock,
  Cpu,
  Coins,
} from 'lucide-react';
import { AIAnalysisHistoryItem } from '@/types';

interface AIConversationHistoryProps {
  history: AIAnalysisHistoryItem[];
  onRegenerate: () => void;
  isLoading?: boolean;
}

export function AIConversationHistory({
  history,
  onRegenerate,
  isLoading,
}: AIConversationHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!history || history.length === 0) return null;

  const handleCopy = (item: AIAnalysisHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(item.analysis, null, 2));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-card overflow-hidden border border-purple-500/20">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-5 py-3.5 bg-slate-900/60 hover:bg-slate-900/80 cursor-pointer transition-all border-b border-white/[0.05]"
      >
        <div className="flex items-center gap-2.5">
          <History size={16} className="text-purple-400" />
          <span className="text-xs font-bold text-white flex items-center gap-2">
            AI Triage & Conversation History
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {history.length} {history.length === 1 ? 'Analysis' : 'Analyses'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate();
            }}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-semibold flex items-center gap-1.5 transition-all border border-purple-500/30 disabled:opacity-50"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            <span>Regenerate AI Analysis</span>
          </button>
          {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {/* Expandable History Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 space-y-3 max-h-96 overflow-y-auto bg-black/20"
          >
            {history.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs transition-all hover:border-purple-500/40"
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                      <Cpu size={12} />
                      {item.model}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {item.confidence}% Conf
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Coins size={12} className="text-amber-400" />
                      {item.tokensUsed} tokens
                    </span>
                    <button
                      onClick={(e) => handleCopy(item, e)}
                      className="text-slate-400 hover:text-white transition-colors p-1"
                      title="Copy JSON Analysis"
                    >
                      {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed line-clamp-2 font-medium">
                  {item.summary}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
