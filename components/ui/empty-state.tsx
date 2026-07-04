'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
        style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
        }}
      >
        <Icon size={28} style={{ color: 'var(--text-muted)' }} />
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#60A5FA',
          }}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
