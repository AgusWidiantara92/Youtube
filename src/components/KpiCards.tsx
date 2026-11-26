'use client';

import React from 'react';
import { GameRecord, KpiSummary } from '@/types/gaming';

interface KpiCardsProps {
  kpi: KpiSummary;
  records: GameRecord[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ records }) => {
  const topOpportunityGame = records.reduce(
    (prev, current) =>
      current.opportunity_score > prev.opportunity_score ? current : prev,
    records[0] || ({} as GameRecord)
  );

  const topEfficiencyGame = records.reduce(
    (prev, current) =>
      (current.avg_views_per_video || 0) > (prev.avg_views_per_video || 0)
        ? current
        : prev,
    records[0] || ({} as GameRecord)
  );

  const risingCount = records.filter((r) => r.trend_status === 'RISING').length;
  const newCount = records.filter((r) => r.trend_status === 'NEW').length;
  const decliningCount = records.filter((r) => r.trend_status === 'DECLINING').length;
  const otherCount = records.length - risingCount - newCount - decliningCount;

  const totalViews = records.reduce((acc, curr) => acc + (curr.recent_views || 0), 0);
  const totalVideos = records.reduce((acc, curr) => acc + (curr.recent_videos || 0), 0);

  return (
    <section
      aria-label="Ringkasan Indikator Utama"
      className="bg-white border border-zinc-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] mb-6 overflow-hidden"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200">
        {/* KPI 1: Ringkasan Dataset */}
        <div className="p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
            Cakupan Entitas Game
          </p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-semibold text-zinc-950 tracking-tight tabular-nums font-mono">
              {records.length}
            </span>
            <span className="text-xs text-zinc-500">game kanonikal</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium tabular-nums">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {risingCount} Naik
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80 font-medium tabular-nums">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {newCount} Baru
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/80 font-medium tabular-nums">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {decliningCount} Turun
            </span>
            {otherCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 font-medium tabular-nums">
                {otherCount} Lainnya
              </span>
            )}
          </div>
        </div>

        {/* KPI 2: Pemimpin Peluang Utama */}
        <div className="p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
            Pemimpin Skor Peluang
          </p>
          <div className="text-xl font-semibold text-zinc-950 tracking-tight capitalize truncate mb-2">
            {topOpportunityGame?.entity || 'N/A'}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono font-semibold text-zinc-900 tabular-nums">
              {topOpportunityGame?.opportunity_score ?? 0}
              <span className="text-zinc-400 font-normal">/100</span>
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-600 truncate">
              {topOpportunityGame?.analysis_label || '-'}
            </span>
          </div>
        </div>

        {/* KPI 3: Efisiensi Penonton / Video */}
        <div className="p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
            Efisiensi Tertinggi / Video
          </p>
          <div className="text-xl font-semibold text-zinc-950 tracking-tight capitalize truncate mb-2">
            {topEfficiencyGame?.entity || 'N/A'}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono font-semibold text-zinc-900 tabular-nums">
              {topEfficiencyGame
                ? `${Math.round(topEfficiencyGame.avg_views_per_video).toLocaleString('id-ID')}`
                : 'N/A'}
            </span>
            <span className="text-zinc-500">views/video</span>
            <span className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-zinc-100 text-zinc-600 border border-zinc-200 tabular-nums">
              {topEfficiencyGame?.recent_videos ?? 0} vid
            </span>
          </div>
        </div>

        {/* KPI 4: Total Penonton Terbaru */}
        <div className="p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
            Total Penonton (7 Hari)
          </p>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl font-semibold text-zinc-950 tracking-tight font-mono tabular-nums">
              {(totalViews / 1_000_000).toFixed(2)}M
            </span>
            <span className="text-xs text-zinc-500">penonton</span>
          </div>
          <p className="text-xs text-zinc-500 tabular-nums">
            Kumulatif dari {totalVideos} video sampel aktif
          </p>
        </div>
      </div>
    </section>
  );
};
