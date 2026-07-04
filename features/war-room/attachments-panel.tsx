'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paperclip,
  Upload,
  FileCode,
  Image as ImageIcon,
  FileText,
  FileBarChart,
  Download,
  Trash2,
  CheckCircle2,
  Eye,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Attachment {
  id: string;
  name: string;
  type: 'log' | 'screenshot' | 'diagram' | 'pdf';
  size: string;
  uploader: string;
  timeAgo: string;
}

const initialAttachments: Attachment[] = [
  {
    id: 'att-1',
    name: 'redis-oom-dump-prod-0947.rdb',
    type: 'log',
    size: '14.2 MB',
    uploader: 'Harshini (CLI)',
    timeAgo: '12 mins ago',
  },
  {
    id: 'att-2',
    name: 'datadog-p99-latency-spike.png',
    type: 'screenshot',
    size: '1.8 MB',
    uploader: 'PagerDuty Bot',
    timeAgo: '15 mins ago',
  },
  {
    id: 'att-3',
    name: 'payment-checkout-arch-v4.pdf',
    type: 'diagram',
    size: '3.4 MB',
    uploader: 'DevOps Team',
    timeAgo: '1 hour ago',
  },
  {
    id: 'att-4',
    name: 'inc-2943-auth-postmortem-draft.pdf',
    type: 'pdf',
    size: '840 KB',
    uploader: 'AI Commander',
    timeAgo: '2 hours ago',
  },
];

export function AttachmentsPanel() {
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleMockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newAtt: Attachment = {
        id: `att-${Date.now()}`,
        name: `kubectl-describe-pod-${Math.floor(Math.random() * 899 + 100)}.txt`,
        type: 'log',
        size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`,
        uploader: 'Harshini (Manual)',
        timeAgo: 'Just now',
      };
      setAttachments((prev) => [newAtt, ...prev]);
      setIsUploading(false);
      showToast('Evidence file successfully uploaded and indexed!');
    }, 1200);
  };

  const handleDelete = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    showToast('Attachment removed.');
  };

  const handleDownload = (name: string) => {
    showToast(`Downloading ${name}...`);
  };

  const getIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'log':
        return <FileCode size={18} className="text-sky-400" />;
      case 'screenshot':
        return <ImageIcon size={18} className="text-purple-400" />;
      case 'diagram':
        return <FileBarChart size={18} className="text-amber-400" />;
      case 'pdf':
        return <FileText size={18} className="text-emerald-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl border p-5 space-y-4 relative overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-blue-500/90 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md"
          >
            <CheckCircle2 size={13} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Paperclip size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Evidence &amp; Attachments</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {attachments.length} items
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Log dumps, Datadog telemetry captures, architecture diagrams, and PDFs
            </p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleMockUpload(); }}
        onClick={handleMockUpload}
        className={cn(
          'p-5 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all group',
          isDragging
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-900/40'
        )}
      >
        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-110 transition-transform">
          {isUploading ? (
            <svg className="animate-spin text-blue-400" width="18" height="18" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <Upload size={18} />
          )}
        </div>
        <p className="text-xs font-bold text-slate-200">
          {isUploading ? 'Uploading evidence file to secure vault...' : 'Click to upload or drag and drop files here'}
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Supports .log, .rdb, .png, .pdf, .json (max 50 MB) &middot; SOC2 compliant storage
        </p>
      </div>

      {/* Attachments List */}
      <div className="space-y-2">
        {attachments.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between gap-3 hover:bg-slate-900/70 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate hover:text-blue-400 cursor-pointer transition-colors" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                  <span className="font-mono">{item.size}</span>
                  <span>&middot;</span>
                  <span>{item.uploader}</span>
                  <span>&middot;</span>
                  <span>{item.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDownload(item.name)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Preview / Download"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                title="Delete attachment"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
