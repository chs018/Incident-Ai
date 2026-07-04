'use client';

/**
 * Engineer Feedback Widget — Slice 7 Persistent Memory Intelligence (War Room)
 *
 * Allows responding engineers to rate AI recommendations (Correct, Helpful,
 * Needs Improvement, Incorrect) and submit comments that dynamically adjust
 * Hindsight confidence weights and institutional learning.
 */

import React, { useState } from 'react';
import { submitFeedback } from '@/services/memory';
import { Check, ThumbsUp, ThumbsDown, MessageSquare, Sparkles, Send, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  incidentId: string;
  recommendationId?: string;
}

export function EngineerFeedbackWidget({ incidentId, recommendationId = 'rec-1' }: Props) {
  const [rating, setRating] = useState<'Correct' | 'Helpful' | 'Needs Improvement' | 'Incorrect' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    submitFeedback({
      incidentId,
      recommendationId,
      engineerId: 'eng-current',
      engineerName: 'Alex Rivera (Principal SRE)',
      rating,
      comment: comment || `Rated AI recommendation as ${rating}`,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-1.5 animate-in fade-in duration-300">
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-xs">
          <ShieldCheck className="h-4 w-4" />
          <span>Feedback Recorded in Hindsight Institutional Memory!</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Your rating ({rating}) has adjusted future vector retrieval weights for this outage pattern.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 glass-card p-4 shadow-lg backdrop-blur-md space-y-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          Rate AI Recommendation Accuracy
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          Reinforces Hindsight memory
        </span>
      </div>

      {/* Rating Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Correct', color: 'emerald', icon: Check },
          { label: 'Helpful', color: 'blue', icon: ThumbsUp },
          { label: 'Needs Improvement', color: 'amber', icon: AlertCircle },
          { label: 'Incorrect', color: 'rose', icon: ThumbsDown },
        ].map((btn) => {
          const Icon = btn.icon;
          const isSelected = rating === btn.label;

          let btnClass = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white';
          if (isSelected) {
            if (btn.color === 'emerald') btnClass = 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold';
            if (btn.color === 'blue') btnClass = 'bg-blue-600/30 border-blue-500 text-blue-300 font-bold';
            if (btn.color === 'amber') btnClass = 'bg-amber-600/30 border-amber-500 text-amber-300 font-bold';
            if (btn.color === 'rose') btnClass = 'bg-rose-600/30 border-rose-500 text-rose-300 font-bold';
          }

          return (
            <button
              key={btn.label}
              type="button"
              onClick={() => setRating(btn.label as any)}
              className={`p-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-all ${btnClass}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Optional Comment & Submit */}
      {rating && (
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-white/5 animate-in slide-in-from-top-1 duration-200">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add operational notes or reason for rating (optional)..."
            className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
            >
              <Send className="h-3 w-3" /> Submit to Hindsight
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
