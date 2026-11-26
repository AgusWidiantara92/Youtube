'use client';

import React, { useState } from 'react';
import { GameRecord, TrendStatus } from '@/types/gaming';
import { ArrowUpDown, LayoutGrid, List, Search, ChevronRight } from 'lucide-react';

interface GameExplorerTabProps {
  records: GameRecord[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectGame: (game: GameRecord) => void;
}

type SortField =
  | 'opportunity_score'
  | 'popularity_score'
  | 'momentum_score'
  | 'avg_views_per_video'
  | 'recent_views'
  | 'view_growth_pct';

const getStatusBadge = (status: TrendStatus) => {
  switch (status) {
    case 'RISING':
      return { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Naik' };
    case 'NEW':
      return { pill: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', label: 'Baru' };
    case 'DECLINING':
      return { pill: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', label: 'Menurun' };
    case 'MIXED':
      return { pill: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Campuran' };
    default:
      return { pill: 'bg-zinc-100 text-zinc-600 border-zinc-200', dot: 'bg-zinc-400', label: status };
  }
};

export const GameExplorerTab: React.FC<GameExplorerTabProps> = ({
  records,
  searchTerm,
  setSearchTerm,
  onSelectGame,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [sortField, setSortField] = useState<SortField>('opportunity_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filterMap: Record<string, string> = {
    Semua: 'ALL',
    Naik: 'RISING',
    Baru: 'NEW',
    Menurun: 'DECLINING',
    'Bukti Tinggi': 'HIGH',
    'Bukti Sedang': 'MEDIUM',
  };

  const filtered = records.filter((g) => {
    const matchesSearch = g.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const mapped = filterMap[selectedStatus] || selectedStatus;
    const matchesStatus =
      mapped === 'ALL' || g.trend_status === mapped || g.evidence_level === mapped;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField] ?? -9999;
    const valB = b[sortField] ?? -9999;
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  return (
    <div className="space-y-5">
      {/* Explorer Toolbar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {Object.keys(filterMap).map((pill) => {
            const active = selectedStatus === pill;
            return (
              <button
                key={pill}
                type="button"
                onClick={() => setSelectedStatus(pill)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* Mobile Search + Sort + View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative md:hidden">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari game..."
              className="pl-8 pr-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-400"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              aria-label="Urutkan berdasarkan"
              className="bg-transparent text-zinc-800 font-medium focus:outline-none cursor-pointer"
            >
              <option value="opportunity_score">Skor Peluang</option>
              <option value="avg_views_per_video">Views / Video</option>
              <option value="popularity_score">Popularitas</option>
              <option value="momentum_score">Momentum</option>
              <option value="recent_views">Total Penonton</option>
              <option value="view_growth_pct">Pertumbuhan %</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="ml-1 text-zinc-500 hover:text-zinc-900 font-mono font-semibold px-1 cursor-pointer"
              title={sortOrder === 'asc' ? 'Urutan naik' : 'Urutan turun'}
            >
              {sortOrder === 'asc' ? 'ASC' : 'DESC'}
            </button>
          </div>

          <div className="inline-flex items-center bg-zinc-100 border border-zinc-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Tampilan Kartu"
              aria-label="Tampilan Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Tampilan Tabel"
              aria-label="Tampilan Tabel"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl py-14 text-center text-xs text-zinc-500">
          Tidak ditemukan entitas game yang sesuai dengan filter saat ini.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((game) => {
            const badge = getStatusBadge(game.trend_status);
            return (
              <article
                key={game.entity}
                onClick={() => onSelectGame(game)}
                className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)] group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-zinc-950 capitalize truncate group-hover:text-blue-600 transition-colors">
                        {game.entity}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{game.analysis_label}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md border shrink-0 ${badge.pill}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  {/* 3 Composite Scores */}
                  <div className="grid grid-cols-3 divide-x divide-zinc-200 bg-zinc-50 border border-zinc-200/80 rounded-lg py-2.5 mb-4 text-center">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Peluang
                      </div>
                      <div className="text-sm font-semibold font-mono text-zinc-950 tabular-nums mt-0.5">
                        {game.opportunity_score}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Popularitas
                      </div>
                      <div className="text-sm font-semibold font-mono text-zinc-950 tabular-nums mt-0.5">
                        {game.popularity_score}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Momentum
                      </div>
                      <div className="text-sm font-semibold font-mono text-zinc-950 tabular-nums mt-0.5">
                        {game.momentum_score !== null ? game.momentum_score : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <dt className="text-zinc-500">Rata-Rata / Video</dt>
                      <dd className="font-mono font-semibold text-zinc-950 tabular-nums">
                        {Math.round(game.avg_views_per_video).toLocaleString('id-ID')}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-zinc-500">Total Penonton</dt>
                      <dd className="font-mono text-zinc-800 tabular-nums">
                        {game.recent_views.toLocaleString('id-ID')}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-zinc-500">Pertumbuhan</dt>
                      <dd
                        className={`font-mono font-medium tabular-nums ${
                          game.view_growth_pct === null
                            ? 'text-blue-700'
                            : game.view_growth_pct >= 0
                            ? 'text-emerald-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {game.view_growth_pct !== null
                          ? `${game.view_growth_pct > 0 ? '+' : ''}${game.view_growth_pct.toFixed(1)}%`
                          : 'Rilis Baru'}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-zinc-500">Rasio Suka</dt>
                      <dd className="font-mono text-zinc-800 tabular-nums">
                        {(game.recent_like_rate * 100).toFixed(2)}%
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="font-mono tabular-nums">
                    {game.recent_videos} video · {game.recent_channels} kanal
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-zinc-700 font-medium group-hover:text-zinc-950">
                    Rincian <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 text-zinc-500 text-[11px] uppercase tracking-wider border-b border-zinc-200">
                  <th className="py-3 pl-5 pr-3 font-medium">Rank</th>
                  <th className="py-3 px-3 font-medium">Game</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Skor Peluang</th>
                  <th className="py-3 px-3 font-medium text-right">Views / Video</th>
                  <th className="py-3 px-3 font-medium text-right">Total Views</th>
                  <th className="py-3 px-3 font-medium text-right">Sampel</th>
                  <th className="py-3 px-3 font-medium">Bukti</th>
                  <th className="py-3 pl-3 pr-5 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sorted.map((game) => {
                  const badge = getStatusBadge(game.trend_status);
                  return (
                    <tr
                      key={game.entity}
                      onClick={() => onSelectGame(game)}
                      className="hover:bg-zinc-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 pl-5 pr-3 font-mono text-zinc-400 tabular-nums">
                        #{game.rank}
                      </td>
                      <td className="py-3 px-3 font-medium text-zinc-950 capitalize">
                        {game.entity}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md border ${badge.pill}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-zinc-950 tabular-nums">
                        {game.opportunity_score}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium text-zinc-900 tabular-nums">
                        {Math.round(game.avg_views_per_video).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-zinc-700 tabular-nums">
                        {game.recent_views.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-zinc-600 tabular-nums">
                        {game.recent_videos} vid
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {game.evidence_level}
                        </span>
                      </td>
                      <td className="py-3 pl-3 pr-5 text-right font-medium text-blue-600 hover:underline">
                        Rincian
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
