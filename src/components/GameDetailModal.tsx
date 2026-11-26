'use client';

import React from 'react';
import { GameRecord } from '@/types/gaming';
import { X } from 'lucide-react';

interface GameDetailModalProps {
  game: GameRecord | null;
  onClose: () => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose }) => {
  if (!game) return null;

  const viewGrowthStr =
    game.view_growth_pct !== null
      ? `${game.view_growth_pct > 0 ? '+' : ''}${game.view_growth_pct.toFixed(1)}%`
      : 'Rilis Baru';

  const commentGrowthStr =
    game.comment_growth_pct !== null
      ? `${game.comment_growth_pct > 0 ? '+' : ''}${game.comment_growth_pct.toFixed(1)}%`
      : 'Rilis Baru';

  const scores = [
    { label: 'Skor Peluang (Opportunity)', value: game.opportunity_score, barColor: 'bg-zinc-900' },
    { label: 'Skor Popularitas', value: game.popularity_score, barColor: 'bg-blue-600' },
    {
      label: 'Skor Momentum',
      value: game.momentum_score,
      barColor: 'bg-emerald-600',
    },
    { label: 'Skor Keterlibatan (Engagement)', value: game.engagement_score, barColor: 'bg-amber-600' },
  ];

  const metrics = [
    { label: 'Penonton Terbaru', value: game.recent_views.toLocaleString('id-ID') },
    { label: 'Penonton Sebelumnya', value: game.previous_views.toLocaleString('id-ID') },
    {
      label: 'Pertumbuhan Penonton',
      value: viewGrowthStr,
      tone:
        game.view_growth_pct === null
          ? 'text-blue-700'
          : game.view_growth_pct >= 0
          ? 'text-emerald-700'
          : 'text-rose-700',
    },
    { label: 'Rasio Suka (Like Rate)', value: `${(game.recent_like_rate * 100).toFixed(2)}%` },
    { label: 'Rasio Komentar', value: `${(game.recent_comment_rate * 100).toFixed(2)}%` },
    {
      label: 'Pertumbuhan Komentar',
      value: commentGrowthStr,
      tone:
        game.comment_growth_pct === null
          ? 'text-blue-700'
          : game.comment_growth_pct >= 0
          ? 'text-emerald-700'
          : 'text-rose-700',
    },
    { label: 'Video Terbaru', value: `${game.recent_videos} video` },
    { label: 'Kanal Aktif', value: `${game.recent_channels} kanal` },
    {
      label: 'Intensitas Diskusi',
      value: game.discussion_intensity_recent?.toFixed(1) || '0.0',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail analitik ${game.entity}`}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-xl border border-zinc-200 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono text-sm font-semibold text-zinc-900">
              #{game.rank}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-950 capitalize tracking-tight">
                {game.entity}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-0.5">
                <span className="font-mono text-[11px] font-medium text-zinc-800 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                  {game.trend_status}
                </span>
                <span>{game.analysis_label}</span>
                <span className="text-zinc-300">·</span>
                <span>Bukti {game.evidence_level}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Composite Scores */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Rincian Skor Analitik Komposit
            </h3>
            <div className="space-y-3 bg-zinc-50 border border-zinc-200/80 rounded-lg p-4">
              {scores.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-700 font-medium">{s.label}</span>
                    <span className="font-mono font-semibold text-zinc-950 tabular-nums">
                      {s.value !== null ? `${s.value} / 100` : 'N/A (Baru)'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.barColor}`}
                      style={{ width: `${Math.min(s.value ?? 50, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Metrics Grid */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Metrik Performa dan Sampel
            </h3>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="p-3 rounded-lg bg-white border border-zinc-200"
                >
                  <dt className="text-[11px] text-zinc-500 mb-1">{m.label}</dt>
                  <dd
                    className={`text-sm font-semibold font-mono tabular-nums ${
                      m.tone || 'text-zinc-950'
                    }`}
                  >
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
