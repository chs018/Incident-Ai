'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Search,
  Filter,
  Copy,
  Check,
  Download,
  Play,
  Pause,
  AlertCircle,
  AlertTriangle,
  Info,
  Flame,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: 'FATAL' | 'ERROR' | 'WARN' | 'INFO';
  message: string;
  requestId: string;
  traceId: string;
  highlight?: boolean;
}

const initialLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '09:47:02.104',
    service: 'api-gateway-prod',
    level: 'INFO',
    message: 'GET /v2/checkout/initiate status=200 latency=42ms client_ip=192.0.2.14',
    requestId: 'req_89a71b',
    traceId: 'tr_40192a',
  },
  {
    id: 'log-2',
    timestamp: '09:47:04.512',
    service: 'redis-session-store',
    level: 'WARN',
    message: 'MEMORY WARNING: maxmemory reached (12.8GB/12.8GB). Eviction policy volatile-lru active.',
    requestId: 'sys_monitor',
    traceId: 'tr_redis_01',
  },
  {
    id: 'log-3',
    timestamp: '09:47:08.891',
    service: 'payment-api-7c9d4',
    level: 'ERROR',
    message: 'Redis OOM command not allowed when used memory > \'maxmemory\'. Failed to write session key s_9941a.',
    requestId: 'req_89a71f',
    traceId: 'tr_40192e',
    highlight: true,
  },
  {
    id: 'log-4',
    timestamp: '09:47:11.203',
    service: 'payment-api-7c9d4',
    level: 'ERROR',
    message: 'Connection Pool Exhausted: 100/100 connections in use. Waiting for available socket...',
    requestId: 'req_89a722',
    traceId: 'tr_401931',
  },
  {
    id: 'log-5',
    timestamp: '09:47:14.650',
    service: 'api-gateway-prod',
    level: 'FATAL',
    message: 'HTTP 503 Service Unavailable returned to client. Upstream payment-api timeout after 5000ms.',
    requestId: 'req_89a722',
    traceId: 'tr_401931',
    highlight: true,
  },
  {
    id: 'log-6',
    timestamp: '09:47:18.112',
    service: 'k8s-controller',
    level: 'WARN',
    message: 'Pod payment-api-7c9d4 liveness probe failed: HTTP GET /healthz responded with 503.',
    requestId: 'k8s_probe',
    traceId: 'tr_k8s_991',
  },
  {
    id: 'log-7',
    timestamp: '09:47:22.401',
    service: 'k8s-controller',
    level: 'FATAL',
    message: 'CrashLoopBackOff: Pod payment-api-7c9d4 restarted 3 times in last 10 minutes.',
    requestId: 'k8s_evict',
    traceId: 'tr_k8s_994',
    highlight: true,
  },
  {
    id: 'log-8',
    timestamp: '09:47:25.809',
    service: 'auth-service-v2',
    level: 'ERROR',
    message: 'TLS Certificate Error: Upstream verification failed for redis-session-store.internal:6379.',
    requestId: 'req_89a730',
    traceId: 'tr_401945',
  },
  {
    id: 'log-9',
    timestamp: '09:47:29.115',
    service: 'payment-api-6b8f1',
    level: 'ERROR',
    message: 'Database Deadlock detected on table \'transactions\' during checkout state update.',
    requestId: 'req_89a733',
    traceId: 'tr_401948',
  },
  {
    id: 'log-10',
    timestamp: '09:47:33.490',
    service: 'kafka-consumer-group',
    level: 'ERROR',
    message: 'Kafka Partition Failure: Leader not available for topic \'checkout-events\' partition 3.',
    requestId: 'kafka_poll',
    traceId: 'tr_kafka_11',
  },
];

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [isStreaming, setIsStreaming] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate live log streaming
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const services = ['payment-api-6b8f1', 'redis-session-store', 'api-gateway-prod', 'k8s-controller'];
      const levels: ('INFO' | 'WARN' | 'ERROR')[] = ['INFO', 'WARN', 'ERROR'];
      const msgs = [
        'Retrying connection to redis-session-store:6379... attempt 2/5',
        'GET /v2/checkout/status status=503 latency=5001ms',
        'Redis maxmemory limit reached. Refusing write operation.',
        'Pod payment-api-6b8f1 memory utilization at 94%.',
      ];
      const randomIdx = Math.floor(Math.random() * msgs.length);
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100),
        service: services[Math.floor(Math.random() * services.length)],
        level: levels[Math.floor(Math.random() * levels.length)],
        message: msgs[randomIdx],
        requestId: `req_${Math.floor(Math.random() * 899999 + 100000).toString(16)}`,
        traceId: `tr_${Math.floor(Math.random() * 899999 + 100000).toString(16)}`,
        highlight: msgs[randomIdx].includes('503') || msgs[randomIdx].includes('Refusing'),
      };

      setLogs((prev) => [...prev.slice(-49), newLog]); // Keep max 50 logs
    }, 3500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Auto-scroll to bottom when streaming
  useEffect(() => {
    if (isStreaming && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, isStreaming]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !search ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.service.toLowerCase().includes(search.toLowerCase()) ||
      log.requestId.toLowerCase().includes(search.toLowerCase()) ||
      log.traceId.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleCopyAll = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.service}] (${l.requestId}) ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRow = (log: LogEntry) => {
    const text = `[${log.timestamp}] [${log.level}] [${log.service}] (${log.requestId}) ${log.message}`;
    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownload = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.service}] (${l.requestId}) ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-logs-${new Date().toISOString().slice(0, 10)}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card rounded-2xl border overflow-hidden flex flex-col h-[520px]" style={{ borderColor: 'var(--border-subtle)' }}>
      {/* Toolbar Header */}
      <div
        className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b shrink-0 bg-slate-950/80"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Terminal size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Live Production Logs</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {filteredLogs.length} events
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time telemetry &middot; Auto-indexed by request ID & trace ID
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Stream Toggle */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
              isStreaming
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            )}
          >
            {isStreaming ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Streaming</span>
              </>
            ) : (
              <>
                <Play size={12} />
                <span>Paused</span>
              </>
            )}
          </button>

          {/* Copy All */}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
          >
            <Download size={13} />
            <span>Export .log</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="px-3.5 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 border-b shrink-0 bg-slate-900/60"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 w-full md:w-auto px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 min-w-0">
          <Search size={13} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Filter by keyword, service, req_id, trace_id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-full font-mono"
          />
        </div>

        {/* Level Pills */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'FATAL', 'ERROR', 'WARN', 'INFO'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={cn(
                'px-2.5 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider transition-all',
                levelFilter === lvl
                  ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                  : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Log Console Body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed space-y-1 glass-card select-text"
      >
        {filteredLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'group flex items-start gap-3 p-2 rounded-lg transition-colors relative',
              log.highlight
                ? 'bg-red-500/[0.08] border border-red-500/20'
                : 'hover:bg-white/[0.03] border border-transparent'
            )}
          >
            {/* Timestamp */}
            <span className="text-slate-500 shrink-0 select-none">{log.timestamp}</span>

            {/* Level Pill */}
            <span
              className={cn(
                'px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0',
                log.level === 'FATAL' && 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
                log.level === 'ERROR' && 'bg-red-500/20 text-red-300 border border-red-500/30',
                log.level === 'WARN' && 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                log.level === 'INFO' && 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              )}
            >
              {log.level}
            </span>

            {/* Service Name */}
            <span className="text-sky-400 font-semibold shrink-0">{log.service}</span>

            {/* Message with syntax highlighting */}
            <div className="flex-1 min-w-0 text-slate-300 break-words">
              {log.message.split(' ').map((word, idx) => {
                if (word.includes('=')) {
                  const [k, v] = word.split('=');
                  return (
                    <span key={idx} className="mr-1">
                      <span className="text-slate-500">{k}=</span>
                      <span className={word.includes('503') || word.includes('500') ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {v}
                      </span>
                    </span>
                  );
                }
                if (word.includes('503') || word.includes('OOM') || word.includes('Deadlock') || word.includes('CrashLoopBackOff')) {
                  return <span key={idx} className="text-red-400 font-bold mr-1">{word}</span>;
                }
                return <span key={idx} className="mr-1">{word}</span>;
              })}
            </div>

            {/* IDs & Copy Row Button */}
            <div className="flex items-center gap-2 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {log.requestId}
              </span>
              <button
                onClick={() => handleCopyRow(log)}
                title="Copy log row"
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                {copiedId === log.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          </motion.div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <FileText size={32} className="mb-2 opacity-40" />
            <p className="text-xs font-semibold">No telemetry logs match your active filters.</p>
            <p className="text-[10px] text-slate-600 mt-1">Try clearing search keywords or selecting ALL log levels.</p>
          </div>
        )}
      </div>
    </div>
  );
}
