'use client';

/**
 * Knowledge Graph Panel — Slice 7 Persistent Memory Intelligence
 *
 * Interactive node-link relationship visualization connecting Services, Incidents,
 * Root Causes, Engineers, and Recovery Runbooks stored in Hindsight persistent memory.
 * Prepared with React Flow compatible data structures.
 */

import React, { useState } from 'react';
import { getKnowledgeGraph } from '@/services/memory';
import { KnowledgeGraphNode } from '@/types';
import { Brain, Sparkles, Server, ShieldAlert, Zap, User, BookOpen, Layers, Filter } from 'lucide-react';

export function KnowledgeGraphPanel() {
  const { nodes, edges } = getKnowledgeGraph();
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(nodes[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNodes = filterType === 'all'
    ? nodes
    : nodes.filter((n) => n.type === filterType);

  // Find connected edges and neighbors for selected node
  const connectedEdges = selectedNode
    ? edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  const neighborIds = new Set(
    connectedEdges.flatMap((e) => [e.source, e.target]).filter((id) => id !== selectedNode?.id)
  );

  const getNodeIcon = (type: KnowledgeGraphNode['type']) => {
    switch (type) {
      case 'service':
        return <Server className="h-4 w-4 text-blue-400" />;
      case 'incident':
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case 'rootCause':
        return <Zap className="h-4 w-4 text-purple-400" />;
      case 'engineer':
        return <User className="h-4 w-4 text-emerald-400" />;
      case 'runbook':
        return <BookOpen className="h-4 w-4 text-cyan-400" />;
      default:
        return <Layers className="h-4 w-4 text-slate-400" />;
    }
  };

  const getNodeTypeLabel = (type: KnowledgeGraphNode['type']) => {
    switch (type) {
      case 'service':
        return 'Microservice';
      case 'incident':
        return 'Historical Outage';
      case 'rootCause':
        return 'Root Cause Pattern';
      case 'engineer':
        return 'Subject Matter Expert';
      case 'runbook':
        return 'Remediation Runbook';
      default:
        return 'Entity';
    }
  };

  const getNodeBadgeColor = (type: KnowledgeGraphNode['type']) => {
    switch (type) {
      case 'service':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'incident':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'rootCause':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'engineer':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'runbook':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Filter */}
      <div className="rounded-xl border border-white/10 glass-card p-5 shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Organizational Knowledge Graph</h3>
            <p className="text-xs text-slate-400">
              Interactive node topology mapping relationships between microservices, outages, root causes, SMEs, and runbooks.
            </p>
          </div>
        </div>

        {/* Node Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <Filter className="h-3.5 w-3.5 text-purple-400 mr-1" />
          {['all', 'service', 'incident', 'rootCause', 'engineer', 'runbook'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-md transition-all shrink-0 font-medium capitalize ${
                filterType === type
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {type === 'all' ? `All Nodes (${nodes.length})` : `${getNodeTypeLabel(type as any)}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Grid Canvas simulation */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 glass-card p-6 shadow-lg backdrop-blur-md min-h-[480px] flex flex-col justify-between relative overflow-hidden">
          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Interactive Graph Topology ({filteredNodes.length} Nodes)
              </span>
              <span className="text-xs text-purple-400 flex items-center gap-1 font-medium">
                <Sparkles className="h-3 w-3" /> Click any node to inspect relationships
              </span>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 relative z-10 pt-2">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isNeighbor = neighborIds.has(node.id);

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20 scale-[1.02]'
                        : isNeighbor
                        ? 'border-blue-500/50 bg-blue-500/5 hover:border-blue-400'
                        : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900/90 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${getNodeBadgeColor(node.type)}`}>
                      {getNodeIcon(node.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider truncate">
                        {getNodeTypeLabel(node.type)}
                      </span>
                      <span className="block text-xs font-semibold text-white truncate">
                        {node.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-400" /> Service</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /> Outage</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-400" /> Root Cause</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> SME</span>
            </div>
            <span>React Flow Vector Engine v2.4</span>
          </div>
        </div>

        {/* Selected Node Details Sidebar */}
        <div className="lg:col-span-1 rounded-xl border border-white/10 glass-card p-6 shadow-lg backdrop-blur-md flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-6">
              {/* Node Header */}
              <div className="space-y-2 border-b border-white/10 pb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider inline-block ${getNodeBadgeColor(selectedNode.type)}`}>
                  {getNodeTypeLabel(selectedNode.type)}
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {getNodeIcon(selectedNode.type)}
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Node ID: {selectedNode.id}
                </p>
              </div>

              {/* Connected Relationships */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Connected Relationships ({connectedEdges.length})
                </span>

                {connectedEdges.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No direct vector edges found.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {connectedEdges.map((edge) => {
                      const neighborId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const neighbor = nodes.find((n) => n.id === neighborId);
                      if (!neighbor) return null;

                      return (
                        <div
                          key={edge.id}
                          onClick={() => setSelectedNode(neighbor)}
                          className="p-3 rounded-lg border border-white/5 bg-slate-900/60 hover:bg-slate-900/90 hover:border-purple-500/30 transition-all cursor-pointer flex items-center justify-between text-xs group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`p-1.5 rounded border shrink-0 ${getNodeBadgeColor(neighbor.type)}`}>
                              {getNodeIcon(neighbor.type)}
                            </span>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-200 block truncate group-hover:text-purple-300">
                                {neighbor.label}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                {edge.label || 'connected to'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-slate-500 text-xs">
              Select a node on the left to inspect its relationships.
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-400">
            <span className="flex items-center justify-center gap-1 text-purple-400 font-medium">
              <Brain className="h-3.5 w-3.5" /> Hindsight Knowledge Graph Indexed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
