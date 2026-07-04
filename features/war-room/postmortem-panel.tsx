'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Loader2, Sparkles, Copy, CheckCheck,
  Download, RefreshCw, AlertCircle,
} from 'lucide-react';
import { Incident } from '@/types';

// ─── Markdown renderer (simple, no external dep) ──────────────

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return (
            <h1 key={i} className="text-base font-extrabold mt-4 first:mt-0" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-sm font-bold mt-4 first:mt-0" style={{ color: 'var(--text-primary)' }}>
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="text-xs font-bold mt-3 uppercase tracking-wider" style={{ color: '#60A5FA' }}>
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{line.slice(2)}</span>
            </div>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          const num = line.match(/^(\d+)\.\s(.+)/);
          return num ? (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] font-mono font-bold mt-0.5 shrink-0 w-4" style={{ color: 'var(--text-muted)' }}>
                {num[1]}.
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{num[2]}</span>
            </div>
          ) : null;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line === '' || line === '---') {
          return <div key={i} className="h-2" />;
        }
        return (
          <p key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

// ─── Postmortem Panel ─────────────────────────────────────────

interface PostmortemPanelProps {
  incident: Incident;
}

export function PostmortemPanel({ incident }: PostmortemPanelProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-postmortem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setContent(data.content);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [incident]);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postmortem-${incident.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <FileText size={13} style={{ color: '#10B981' }} />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              AI Postmortem
            </h2>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Blameless · Groq generated
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {content && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                style={{ background: 'var(--bg-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
              >
                {copied ? <CheckCheck size={11} style={{ color: '#10B981' }} /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                style={{ background: 'var(--bg-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
              >
                <Download size={11} />
                .md
              </button>
              <button
                onClick={generate}
                disabled={loading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                style={{ background: 'var(--bg-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
              >
                <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                Regenerate
              </button>
            </>
          )}
          {!content && (
            <button
              onClick={generate}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                color: 'white',
                boxShadow: '0 0 12px rgba(16,185,129,0.3)',
              }}
            >
              {loading ? (
                <><Loader2 size={11} className="animate-spin" /> Generating…</>
              ) : (
                <><Sparkles size={11} /> Generate Postmortem</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Loader2 size={14} className="animate-spin" style={{ color: '#10B981' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Drafting blameless postmortem…
                </span>
              </div>
              {[100, 80, 90, 70, 85, 60, 75, 55].map((w, i) => (
                <div key={i} className="skeleton rounded" style={{ height: 12, width: `${w}%` }} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              <AlertCircle size={14} style={{ color: '#EF4444' }} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#FCA5A5' }}>Generation failed</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{error}</p>
                <button onClick={generate} className="text-xs mt-2 font-semibold" style={{ color: '#60A5FA' }}>
                  Retry →
                </button>
              </div>
            </motion.div>
          ) : content ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-h-[480px] overflow-y-auto pr-1"
              style={{ scrollbarWidth: 'thin' }}
            >
              <SimpleMarkdown content={content} />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <FileText size={24} style={{ color: '#10B981' }} />
              </div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                AI Postmortem Draft
              </p>
              <p className="text-xs mb-5 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
                Generate a blameless postmortem with executive summary, timeline, root cause, impact, and action items.
                {!['resolved', 'postmortem'].includes(incident.status) && (
                  <span className="block mt-2 font-semibold" style={{ color: '#FCD34D' }}>
                    Incident is still active — postmortem will use current known data.
                  </span>
                )}
              </p>
              <button
                onClick={generate}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
                }}
              >
                <Sparkles size={14} />
                Generate Postmortem
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
