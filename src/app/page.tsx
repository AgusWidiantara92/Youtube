'use client';

import React, { useState } from 'react';
import gamingData from '@/data/gaming_trend_data.json';
import { GameRecord, GamingDataset } from '@/types/gaming';
import { Header } from '@/components/Header';
import { KpiCards } from '@/components/KpiCards';
import { OverviewTab } from '@/components/OverviewTab';
import { GameExplorerTab } from '@/components/GameExplorerTab';
import { AnalyticsMatrixTab } from '@/components/AnalyticsMatrixTab';
import { DetailedReportTab } from '@/components/DetailedReportTab';
import { GameDetailModal } from '@/components/GameDetailModal';
import { VercelDeployModal } from '@/components/VercelDeployModal';
import { LayoutDashboard, Compass, ScatterChart, FileText, Database } from 'lucide-react';

const dataset = gamingData as unknown as GamingDataset;

const TABS = [
  { id: 'overview' as const, label: 'Ringkasan Eksekutif', icon: LayoutDashboard },
  { id: 'explorer' as const, label: 'Penjelajah Game', icon: Compass },
  { id: 'matrix' as const, label: 'Matriks & Komparasi', icon: ScatterChart },
  { id: 'report' as const, label: 'Laporan Analisis', icon: FileText },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'explorer' | 'matrix' | 'report'>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<GameRecord | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  const records: GameRecord[] = dataset.final;

  const exportCsv = () => {
    const headers = [
      'rank',
      'entity',
      'trend_status',
      'evidence_level',
      'opportunity_score',
      'popularity_score',
      'momentum_score',
      'avg_views_per_video',
      'recent_views',
      'previous_views',
      'view_growth_pct',
      'comment_growth_pct',
      'recent_like_rate',
      'recent_comment_rate',
      'analysis_label',
    ];

    const rows = records.map((r) => [
      r.rank,
      `"${r.entity.replace(/"/g, '""')}"`,
      r.trend_status,
      r.evidence_level,
      r.opportunity_score,
      r.popularity_score,
      r.momentum_score ?? '',
      r.avg_views_per_video,
      r.recent_views,
      r.previous_views,
      r.view_growth_pct ?? '',
      r.comment_growth_pct ?? '',
      r.recent_like_rate,
      r.recent_comment_rate,
      `"${r.analysis_label.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `final_game_trend_v3_8_39_id.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white pb-16">
      <Header
        version={`v${dataset.version}`}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onExportCsv={exportCsv}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Compact Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sumber dataset:</span>
            <code className="font-mono text-[11px] text-zinc-700 bg-white px-2 py-0.5 rounded border border-zinc-200">
              final_game_trend_v3_8_39_id.csv
            </code>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
            <span>Pipeline v{dataset.version}</span>
            <span className="text-zinc-300">·</span>
            <span>Pembaruan: {dataset.lastUpdated}</span>
          </div>
        </div>

        {/* Unified KPI Metric Strip */}
        <KpiCards kpi={dataset.kpi} records={records} />

        {/* Editorial Underline Navigation Tabs */}
        <nav
          aria-label="Navigasi Dashboard"
          className="flex items-center gap-1 border-b border-zinc-200 mb-6 overflow-x-auto"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-zinc-950 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Tab View */}
        {activeTab === 'overview' && (
          <OverviewTab
            records={records}
            version={dataset.version}
            searchTerm={searchTerm}
            onSelectGame={(g) => setSelectedGame(g)}
          />
        )}

        {activeTab === 'explorer' && (
          <GameExplorerTab
            records={records}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSelectGame={(g) => setSelectedGame(g)}
          />
        )}

        {activeTab === 'matrix' && (
          <AnalyticsMatrixTab records={records} onSelectGame={(g) => setSelectedGame(g)} />
        )}

        {activeTab === 'report' && (
          <DetailedReportTab records={records} kpi={dataset.kpi} version={dataset.version} />
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
        <span>YouTube Gaming Trend Analytics · PT Pandora Digital Entertainment</span>
        <span className="font-mono">Pipeline v{dataset.version} · {records.length} entitas tervalidasi</span>
      </footer>

      <GameDetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      <VercelDeployModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />
    </div>
  );
}
