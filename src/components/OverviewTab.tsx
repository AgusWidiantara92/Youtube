'use client';

import React, { useState } from 'react';
import { GameRecord, TrendStatus } from '@/types/gaming';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ArrowUpRight,
  Minus,
} from 'lucide-react';

interface OverviewTabProps {
  records: GameRecord[];
  version?: string;
  searchTerm?: string;
  onSelectGame: (game: GameRecord) => void;
}

const STATUS_COLORS: Record<string, string> = {
  RISING: '#059669',
  NEW: '#2563eb',
  DECLINING: '#e11d48',
  MIXED: '#d97706',
  INSUFFICIENT_DATA: '#71717a',
};

const STATUS_LABELS_ID: Record<string, string> = {
  RISING: 'Naik',
  NEW: 'Baru',
  DECLINING: 'Menurun',
  MIXED: 'Campuran',
  INSUFFICIENT_DATA: 'Data Kurang',
};

const getStatusBadgeClasses = (status: TrendStatus) => {
  switch (status) {
    case 'RISING':
      return {
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Naik',
      };
    case 'NEW':
      return {
        pill: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Baru',
      };
    case 'DECLINING':
      return {
        pill: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'Menurun',
      };
    case 'MIXED':
      return {
        pill: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Campuran',
      };
    default:
      return {
        pill: 'bg-zinc-100 text-zinc-600 border-zinc-200',
        dot: 'bg-zinc-400',
        label: 'Data Kurang',
      };
  }
};

export const OverviewTab: React.FC<OverviewTabProps> = ({
  records,
  version = '3.8.39 ID',
  searchTerm = '',
  onSelectGame,
}) => {
  const [rankingMode, setRankingMode] = useState<'views' | 'efficiency' | 'opportunity'>('views');

  const filteredRecords = searchTerm.trim()
    ? records.filter((r) => r.entity.toLowerCase().includes(searchTerm.toLowerCase()))
    : records;

  const rankedGames = [...filteredRecords].sort((a, b) => {
    if (rankingMode === 'views') return b.recent_views - a.recent_views;
    if (rankingMode === 'efficiency') return b.avg_views_per_video - a.avg_views_per_video;
    return b.opportunity_score - a.opportunity_score;
  });

  const statusCounts = records.reduce((acc, curr) => {
    acc[curr.trend_status] = (acc[curr.trend_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map((status) => ({
    name: STATUS_LABELS_ID[status] || status,
    value: statusCounts[status],
    color: STATUS_COLORS[status] || '#71717a',
  }));

  const sortedByOpp = [...records].sort((a, b) => b.opportunity_score - a.opportunity_score);
  const sortedByEfficiency = [...records].sort((a, b) => b.avg_views_per_video - a.avg_views_per_video);

  const risingGames = records
    .filter((r) => r.trend_status === 'RISING')
    .sort((a, b) => b.opportunity_score - a.opportunity_score);
  const topRising = risingGames[0];
  const topEfficiencyGame = sortedByEfficiency[0];
  const topViewsGame = [...records].sort((a, b) => b.recent_views - a.recent_views)[0];

  const modeSubtitle =
    rankingMode === 'views'
      ? 'Diurutkan berdasarkan total penayangan 7 hari terakhir'
      : rankingMode === 'efficiency'
      ? 'Diurutkan berdasarkan rata-rata penayangan per video sampel'
      : 'Diurutkan berdasarkan skor peluang komposit (skala 0 hingga 100)';

  return (
    <div className="space-y-6">
      {/* Main Ranking Table */}
      <section className="bg-white border border-zinc-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950 tracking-tight">
              Peringkat Game YouTube Gaming (Pipeline v{version})
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">{modeSubtitle}</p>
          </div>

          {/* Segmented Control */}
          <div className="inline-flex items-center bg-zinc-100 border border-zinc-200 rounded-lg p-0.5 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setRankingMode('views')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                rankingMode === 'views'
                  ? 'bg-white text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Total Penonton
            </button>
            <button
              type="button"
              onClick={() => setRankingMode('efficiency')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                rankingMode === 'efficiency'
                  ? 'bg-white text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Views / Video
            </button>
            <button
              type="button"
              onClick={() => setRankingMode('opportunity')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                rankingMode === 'opportunity'
                  ? 'bg-white text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Skor Peluang
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 text-zinc-500 border-b border-zinc-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 pl-5 pr-3 font-medium w-14">#</th>
                <th className="py-3 px-3 font-medium">Nama Game</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium text-right">Pertumbuhan</th>
                <th className="py-3 px-3 font-medium text-right">Total Penonton</th>
                <th className="py-3 px-3 font-medium text-right">Views / Video</th>
                <th className="py-3 px-3 font-medium">Skor Peluang</th>
                <th className="py-3 pl-3 pr-5 font-medium text-right w-20">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rankedGames.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-zinc-500 text-xs">
                    Tidak ada game yang cocok dengan kata kunci &ldquo;{searchTerm}&rdquo;.
                  </td>
                </tr>
              ) : (
                rankedGames.map((game, index) => {
                  const badge = getStatusBadgeClasses(game.trend_status);
                  const rankNum = String(index + 1).padStart(2, '0');
                  return (
                    <tr
                      key={game.entity}
                      onClick={() => onSelectGame(game)}
                      className="hover:bg-zinc-50/90 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 pl-5 pr-3 font-mono text-xs text-zinc-400 tabular-nums">
                        <span
                          className={
                            index < 3
                              ? 'font-semibold text-zinc-900'
                              : 'text-zinc-400'
                          }
                        >
                          {rankNum}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-950 capitalize text-[13px] group-hover:text-blue-600 transition-colors">
                            {game.entity}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {game.recent_videos} vid
                          </span>
                          {game.activity_state === 'WATCHLIST_INACTIVE' && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Watchlist
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md border ${badge.pill}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono tabular-nums">
                        {game.trend_status === 'RISING' && game.view_growth_pct !== null && (
                          <span className="inline-flex items-center justify-end gap-1 text-emerald-700 font-medium">
                            <TrendingUp className="w-3.5 h-3.5" />
                            +{game.view_growth_pct.toFixed(1)}%
                          </span>
                        )}
                        {game.trend_status === 'NEW' && (
                          <span className="inline-flex items-center justify-end gap-1 text-blue-700 font-medium">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Rilis Baru
                          </span>
                        )}
                        {game.trend_status === 'DECLINING' && (
                          <span className="inline-flex items-center justify-end gap-1 text-rose-700 font-medium">
                            <TrendingDown className="w-3.5 h-3.5" />
                            {game.view_growth_pct !== null
                              ? `${game.view_growth_pct.toFixed(1)}%`
                              : 'Inaktif'}
                          </span>
                        )}
                        {game.trend_status !== 'RISING' &&
                          game.trend_status !== 'NEW' &&
                          game.trend_status !== 'DECLINING' && (
                            <span className="inline-flex items-center justify-end gap-1 text-zinc-500">
                              <Minus className="w-3 h-3" />
                              {game.view_growth_pct !== null
                                ? `${game.view_growth_pct > 0 ? '+' : ''}${game.view_growth_pct.toFixed(1)}%`
                                : 'N/A'}
                            </span>
                          )}
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-mono tabular-nums whitespace-nowrap ${
                          rankingMode === 'views'
                            ? 'font-semibold text-zinc-950'
                            : 'text-zinc-700'
                        }`}
                      >
                        {game.recent_views.toLocaleString('id-ID')}
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-mono tabular-nums whitespace-nowrap ${
                          rankingMode === 'efficiency'
                            ? 'font-semibold text-zinc-950'
                            : 'text-zinc-700'
                        }`}
                      >
                        {Math.round(game.avg_views_per_video).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5 min-w-[110px]">
                          <span
                            className={`font-mono tabular-nums w-9 ${
                              rankingMode === 'opportunity'
                                ? 'font-semibold text-zinc-950'
                                : 'text-zinc-700'
                            }`}
                          >
                            {game.opportunity_score.toFixed(1)}
                          </span>
                          <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden max-w-[72px]">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(game.opportunity_score, 100)}%`,
                                backgroundColor: STATUS_COLORS[game.trend_status] || '#18181b',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-0.5 text-zinc-500 group-hover:text-zinc-950 font-medium transition-colors">
                          Rincian
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Opportunity Score Bar Chart */}
        <section className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950 tracking-tight">
                Skor Peluang Komposit
              </h2>
              <p className="text-xs text-zinc-500">
                Gabungan popularitas, momentum pertumbuhan, dan bukti sampel
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Skala 0 hingga 100</span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={sortedByOpp}
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  axisLine={{ stroke: '#e4e4e7' }}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="entity"
                  axisLine={{ stroke: '#e4e4e7' }}
                  tickLine={false}
                  tick={{ fill: '#18181b', fontSize: 12, fontWeight: 500 }}
                  width={136}
                />
                <Tooltip
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e4e4e7',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    color: '#09090b',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#18181b', fontWeight: 600 }}
                  labelStyle={{ color: '#52525b', fontWeight: 600, textTransform: 'capitalize' }}
                  formatter={(value: unknown, _name?: unknown, item?: { payload?: GameRecord }) => [
                    `${value} poin`,
                    item?.payload?.analysis_label || 'Skor Peluang',
                  ]}
                />
                <Bar dataKey="opportunity_score" radius={[0, 4, 4, 0]} barSize={18}>
                  {sortedByOpp.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.trend_status] || '#18181b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Chart 2: Trend Status Proportion */}
        <section className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950 tracking-tight">
                Distribusi Status Tren
              </h2>
              <p className="text-xs text-zinc-500">
                Proporsi klasifikasi arah pergerakan pasar
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">{records.length} entitas</span>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e4e4e7',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    color: '#09090b',
                    fontSize: '12px',
                  }}
                  formatter={(value: unknown) => [`${value} game`, 'Jumlah']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-semibold font-mono text-zinc-950 tabular-nums">
                {records.length}
              </span>
              <span className="text-[11px] text-zinc-500">Total Game</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-2 pt-4 border-t border-zinc-100">
            {pieData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs"
              >
                <span className="flex items-center gap-2 text-zinc-700 font-medium">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </span>
                <span className="font-mono font-semibold text-zinc-950 tabular-nums">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Chart 3: Efficiency Views per Video */}
      <section className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950 tracking-tight">
              Efisiensi Rata-Rata Penonton per Video
            </h2>
            <p className="text-xs text-zinc-500">
              Penyetaraan sampel dengan membagi total penayangan terhadap jumlah video aktif
            </p>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">Satuan: views/video</span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedByEfficiency}
              margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
              <XAxis
                type="number"
                axisLine={{ stroke: '#e4e4e7' }}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
              />
              <YAxis
                type="category"
                dataKey="entity"
                axisLine={{ stroke: '#e4e4e7' }}
                tickLine={false}
                tick={{ fill: '#18181b', fontSize: 12, fontWeight: 500 }}
                width={136}
              />
              <Tooltip
                cursor={{ fill: '#f4f4f5' }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e4e4e7',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  color: '#09090b',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#52525b', fontWeight: 600, textTransform: 'capitalize' }}
                formatter={(val: unknown) => [
                  `${Math.round(Number(val)).toLocaleString('id-ID')} views/video`,
                  'Rata-Rata Penonton',
                ]}
              />
              <Bar dataKey="avg_views_per_video" fill="#18181b" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Analytical Key Takeaways */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topRising && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-700">
                Momentum Tertinggi
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                Skor {topRising.opportunity_score}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-zinc-950 capitalize mb-1.5">
              {topRising.entity}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Pertumbuhan penonton{' '}
              <span className="font-mono font-medium text-emerald-700">
                +{topRising.view_growth_pct?.toFixed(1)}%
              </span>{' '}
              dengan skor momentum{' '}
              <span className="font-mono font-medium text-zinc-900">
                {topRising.momentum_score ?? 'N/A'}
              </span>{' '}
              dari {topRising.recent_videos} video pada {topRising.recent_channels} kanal aktif.
            </p>
          </div>
        )}

        {topEfficiencyGame && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Efisiensi Konten Teratas
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {topEfficiencyGame.recent_videos} video
              </span>
            </div>
            <h3 className="text-sm font-semibold text-zinc-950 capitalize mb-1.5">
              {topEfficiencyGame.entity}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Meraih rata-rata{' '}
              <span className="font-mono font-medium text-zinc-950">
                {Math.round(topEfficiencyGame.avg_views_per_video).toLocaleString('id-ID')} views/video
              </span>{' '}
              dengan total jangkauan {topEfficiencyGame.recent_views.toLocaleString('id-ID')} penonton.
            </p>
          </div>
        )}

        {topViewsGame && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-blue-700">
                Volume Penonton Terbesar
              </span>
              <span className="text-[11px] font-mono text-zinc-500">v{version}</span>
            </div>
            <h3 className="text-sm font-semibold text-zinc-950 capitalize mb-1.5">
              {topViewsGame.entity}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Mengumpulkan{' '}
              <span className="font-mono font-medium text-zinc-950">
                {topViewsGame.recent_views.toLocaleString('id-ID')} views
              </span>{' '}
              dalam jendela pengamatan 7 hari terakhir dengan tingkat bukti{' '}
              <span className="font-medium text-zinc-800">{topViewsGame.evidence_level}</span>.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
