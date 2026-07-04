'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Trash2, Mail, Shield, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { OnboardingFormData, InvitedMember } from './onboarding-types';

interface StepTeamProps {
  formData: OnboardingFormData;
  updateForm: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ROLES = [
  'Administrator',
  'Platform Engineer',
  'SRE',
  'DevOps Engineer',
  'Security Engineer',
  'Engineering Manager',
];

const DEPARTMENTS = [
  'Platform Engineering',
  'Infrastructure',
  'Cloud Operations',
  'Security',
  'SRE',
];

export function StepTeam({ formData, updateForm, onNext, onBack }: StepTeamProps) {
  // Initialize with 2 default teammates if empty
  const [members, setMembers] = useState<InvitedMember[]>(() => {
    if (formData.members && formData.members.length > 0) {
      return formData.members;
    }
    return [
      {
        id: '1',
        name: 'Sophia Chen',
        email: 'sophia.c@cloudnova.io',
        role: 'Platform Engineer',
        department: 'Platform Engineering',
      },
      {
        id: '2',
        name: 'Daniel Carter',
        email: 'daniel.c@cloudnova.io',
        role: 'SRE',
        department: 'SRE',
      },
    ];
  });

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState(ROLES[1]);
  const [newDept, setNewDept] = useState(DEPARTMENTS[0]);
  const [error, setError] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setError('Please provide both name and work email.');
      return;
    }
    if (!newEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    const nextMembers = [
      ...members,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        email: newEmail.trim(),
        role: newRole,
        department: newDept,
      },
    ];

    setMembers(nextMembers);
    updateForm({ members: nextMembers });
    setNewName('');
    setNewEmail('');
    setError('');
  };

  const handleRemove = (id: string) => {
    const nextMembers = members.filter(m => m.id !== id);
    setMembers(nextMembers);
    updateForm({ members: nextMembers });
  };

  const handleContinue = () => {
    updateForm({ members });
    onNext();
  };

  const handleSkip = () => {
    updateForm({ members: [] });
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Invite your Engineering Team
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Collaborate in real-time. On-call engineers will receive instant AI root-cause briefings.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Invite Form & Table (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Add Member Box */}
          <form onSubmit={handleAddMember} className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Add Team Member
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Olivia Brooks"
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Work Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="olivia@cloudnova.io"
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {ROLES.map(r => <option key={r} value={r} style={{ background: '#0B1120' }}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Department</label>
                <select
                  value={newDept}
                  onChange={e => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: '#0B1120' }}>{d}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-blue-600"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)' }}
            >
              <UserPlus size={15} />
              <span>Invite Another Member</span>
            </button>
          </form>

          {/* Dynamic Table */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pending Invitations ({members.length})
              </h3>
              <span className="text-[10px] text-slate-500">Mock invites sent on launch</span>
            </div>

            {members.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-500 text-xs">
                No teammates invited yet. Add teammates above or skip for now.
              </div>
            ) : (
              <div className="space-y-2 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="pb-2.5 pl-2">Member</th>
                      <th className="pb-2.5">Role</th>
                      <th className="pb-2.5">Department</th>
                      <th className="pb-2.5 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    <AnimatePresence>
                      {members.map(m => (
                        <motion.tr
                          key={m.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="group hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3 pl-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-300">
                                {m.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{m.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{m.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                              {m.role}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400 text-[11px]">
                            {m.department}
                          </td>
                          <td className="py-3 text-right pr-2">
                            <button
                              type="button"
                              onClick={() => handleRemove(m.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Remove invite"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: RBAC & Access Preview (4 cols) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="space-y-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              RBAC & Access Control
            </span>
            <p className="text-[11px] text-slate-400">
              How permissions are distributed across your workspace.
            </p>
          </div>

          <div className="glass-card p-5 space-y-4 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <Shield size={18} className="text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Zero-Trust Security</h4>
                <p className="text-[10px] text-slate-400">Role-Based Access Control</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Administrator</span>
                  <span className="text-blue-400">Full Access</span>
                </div>
                <p className="text-[10px] text-slate-400">Can manage telemetry connections, billing, and organizational settings.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Platform Engineer / SRE</span>
                  <span className="text-emerald-400">War Room</span>
                </div>
                <p className="text-[10px] text-slate-400">Can trigger AI runbook execution, resolve incidents, and edit postmortems.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Security Engineer</span>
                  <span className="text-purple-400">Audit & Logs</span>
                </div>
                <p className="text-[10px] text-slate-400">Read-only access to incident timelines, blast radius maps, and audit logs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-slate-800/60"
          style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Skip for Now
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
            }}
          >
            <span>Continue to Preferences</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
