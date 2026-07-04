'use client';

import { cn, getSeverityColor, getStatusColor, getPriorityColor } from '@/lib/utils';
import { IncidentSeverity, IncidentStatus, IncidentPriority } from '@/types';

interface StatusBadgeProps {
  variant: 'severity' | 'status' | 'priority' | 'custom';
  value: string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ variant, value, className, showDot = true }: StatusBadgeProps) {
  const colorClass =
    variant === 'severity'
      ? getSeverityColor(value as IncidentSeverity)
      : variant === 'status'
      ? getStatusColor(value as IncidentStatus)
      : variant === 'priority'
      ? getPriorityColor(value as IncidentPriority)
      : '';

  return (
    <span className={cn('status-badge', colorClass, className)}>
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'currentColor', opacity: 0.8 }}
        />
      )}
      {value}
    </span>
  );
}
