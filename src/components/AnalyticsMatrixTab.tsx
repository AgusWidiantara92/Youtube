'use client';

import React from 'react';
import { GameRecord } from '@/types/gaming';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';

interface AnalyticsMatrixTabProps {
  records: GameRecord[];
  onSelectGame: (game: GameRecord) => void;
}

const STATUS_COLORS: Record<string, string> = {
  RISING: '#059669',
  NEW: '#2563eb',
  DECLINING: '#e11d48',
  MIXED: '#d97706',
  INSUFFICIENT_DATA: '#71717a',
};

export const AnalyticsMatrixTab: React.FC<AnalyticsMatrixTabProps> = ({
  records,
  onSelectGame,
}) => {
  const scatterData = records.map((g) => ({
    name: g.entity,
    popularity: g.popularity_score,
    momentum: g.momentum_score ?? 50,
    recentViews: g.recent_views,
    status: g.trend_status,
    record: g,
  }));

  const viewsComparisonData = records.map((g) => ({
    name: g.entity,
    'Periode Terbaru': g.recent_views,
    'Periode Sebelumnya': g.previous_views,
  }));

  const growthData = records
    .filter((g) => g.view_growth_pct !== null && g.comment_growth_pct !== null)
    .map((g) => ({
      name: g.entity,
      'Pertumbuhan Penonton (%)': Math.round(g.view_growth_pct || 0),
      'Pertumbuhan Komentar (%)': Math.round(g.comment_growth_pct || 0),
    }));

  return (
    <div className="space-y-6">
      {/* Scatter Matrix */}
      <section className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950 tracking-tight">
              Matriks Momentum vs Jangkauan Popularitas
            </h2>
            <p className="text-xs text-zinc-500">
              Ukuran titik merepresentasikan total penayangan; klik titik untuk membuka rincian game
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> Naik
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Baru
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" /> Menurun
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 20, bottom: 16, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <ReferenceLine x={50} stroke="#d4d4d8" strokeDasharray="4 4" />
              <ReferenceLine y={50} stroke="#d4d4d8" strokeDasharray="4 4" />
              <XAxis
                type="number"
                dataKey="popularity"
                name="Popularitas"
                domain={[0, 100]}
                axisLine={{ stroke: '#e4e4e7' }}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="momentum"
                name="Momentum"
                domain={[0, 100]}
                axisLine={{ stroke: '#e4e4e7' }}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="recentViews" range={[70, 420]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3', stroke: '#a1a1aa' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-zinc-200 p-3 rounded-lg text-xs space-y-1 shadow-md">
                        <div className="font-semibold text-zinc-950 capitalize text-[13px]">
                          {data.name}
                        </div>
                        <div className="text-zinc-600 font-mono tabular-nums">
                          Momentum: <span className="text-zinc-950 font-medium">{data.momentum}</span>
                        </div>
                        <div className="text-zinc-600 font-mono tabular-nums">
                          Popularitas: <span className="text-zinc-950 font-medium">{data.popularity}</span>
                        </div>
                        <div className="text-zinc-600 font-mono tabular-nums">
                          Penonton:{' '}
                          <span className="text-zinc-950 font-medium">
                            {data.recentViews.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase pt-0.5 border-t border-zinc-100">
                          Status: {data.status}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Game"
                data={scatterData}
                onClick={(entry) => {
                  const rec = (entry as unknown as { payload?: { record?: GameRecord } })?.payload?.record;
                  if (rec) onSelectGame(rec);
                }}
                className="cursor-pointer"
              >
                {scatterData.map((entry, idx) => (
                  <Cell
                    key={`scatter-${idx}`}
                    fill={STATUS_COLORS[entry.status] || '#18181b'}
                    fillOpacity={0.85}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Two Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-950 tracking-tight">
              Penonton Periode Terbaru vs Sebelumnya
            </h3>
            <p className="text-xs text-zinc-500">
              Komparasi jendela pengamatan 7 hari berjalan terhadap 7 hari sebelumnya
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={viewsComparisonData}
                margin={{ top: 8, right: 8, left: 4, bottom: 28 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis
                  dataKey="name"
                  axisLine={{ stroke: '#e4e4e7' }}
                  tickLine={false}
                  tick={{ fill: '#3f3f46', fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  axisLine={{ stroke: '#e4e4e7' }}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  tickFormatter={(v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
                />
                <Tooltip
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e4e4e7',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#52525b', fontWeight: 600, textTransform: 'capitalize' }}
                  formatter={(val: unknown, name?: unknown) => [
                    Number(val).toLocaleString('id-ID'),
                    String(name || 'Penonton'),
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Periode Terbaru" fill="#18181b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Periode Sebelumnya" fill="#d4d4d8" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-950 tracking-tight">
              Pertumbuhan Penonton vs Pertumbuhan Komentar (%)
            </h3>
            <p className="text-xs text-zinc-500">
              Hanya menampilkan entitas dengan baseline pembanding pada kedua periode
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={growthData}
                margin={{ top: 8, right: 8, left: 4, bottom: 28 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <ReferenceLine y={0} stroke="#a1a1aa" />
                <XAxis
                  dataKey="name"
                  axisLine={{ stroke: '#e4e4e7' }}
                  tickLine={false}
                  tick={{ fill: '#3f3f46', fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  axisLine={{ stroke: '#e4e4e7' }}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e4e4e7',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#52525b', fontWeight: 600, textTransform: 'capitalize' }}
                  formatter={(val: unknown, name?: unknown) => [`${val}%`, String(name || 'Pertumbuhan')]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Pertumbuhan Penonton (%)" fill="#059669" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Pertumbuhan Komentar (%)" fill="#2563eb" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};
