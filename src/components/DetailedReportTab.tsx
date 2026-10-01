'use client';

import React from 'react';
import { GameRecord, KpiSummary } from '@/types/gaming';
import {
  FileText,
  TrendingUp,
  Sparkles,
  TrendingDown,
  Zap,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface DetailedReportTabProps {
  records: GameRecord[];
  kpi: KpiSummary;
}

export const DetailedReportTab: React.FC<DetailedReportTabProps> = ({ records, kpi }) => {
  const risingGames = records.filter((r) => r.trend_status === 'RISING');
  const newGames = records.filter((r) => r.trend_status === 'NEW');
  const decliningGames = records.filter((r) => r.trend_status === 'DECLINING');

  const sortedByEfficiency = [...records].sort((a, b) => b.avg_views_per_video - a.avg_views_per_video);
  const topEfficiency = sortedByEfficiency[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Banner Judul Laporan */}
      <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
        <div className="flex items-center gap-3 text-cyan-400 font-bold text-xs uppercase tracking-widest mb-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          Laporan Analisis Eksekutif Resmi Pipeline V3.8.39 ID
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-3">
          Analisis Trend Deskriptif & Performa Interaksi YouTube Gaming (Indonesia)
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Dokumen ini menyajikan rincian komprehensif mengenai hasil olahan data <b>YouTube Gaming Analytics Pipeline V3.8.39 ID</b>.
          Laporan ini mengevaluasi <b>{records.length} game utama</b> berdasarkan sinyal momentum, jangkauan popularitas, kualitas keterlibatan penonton (engagement), serta efisiensi per konten video.
        </p>
      </div>

      {/* Bagian 1: Ringkasan Temuan Utama (Executive Summary Findings) */}
      <div className="glass-panel p-7 rounded-3xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Award className="w-5 h-5 text-purple-400" />
          1. Ringkasan Temuan Utama & Performa Teratas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {risingGames.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-400 text-sm">
                <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Pemimpin Momentum (Rising)</span>
                <span className="capitalize">{risingGames[0].entity}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                <b>{risingGames[0].entity.toUpperCase()}</b> mencatatkan lonjakan performa terkuat dalam periode ini dengan pertumbuhan penonton <b>+{risingGames[0].view_growth_pct?.toFixed(1)}%</b> (dari {risingGames[0].previous_views.toLocaleString()} menjadi {risingGames[0].recent_views.toLocaleString()} views), didukung pertumbuhan komentar <b>+{risingGames[0].comment_growth_pct?.toFixed(1)}%</b> dan Skor Peluang <b>{risingGames[0].opportunity_score} poin</b>.
              </p>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between font-bold text-amber-400 text-sm">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Efisiensi Konten Teratas</span>
              <span className="capitalize">{topEfficiency?.entity}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Secara rata-rata penonton per video (penyetaraan sampel), <b>{topEfficiency?.entity.toUpperCase()}</b> menghasilkan efisiensi tertinggi dengan <b>{topEfficiency?.avg_views_per_video.toLocaleString()} views/video</b> dari sampel {topEfficiency?.recent_videos} video.
            </p>
          </div>
        </div>
      </div>

      {/* Bagian 2: Analisis Kategori & Segmentasi Status Game */}
      <div className="glass-panel p-7 rounded-3xl space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-cyan-400" />
          2. Rincian Analisis Berdasarkan Kategori Status Trend
        </h2>

        {/* Kategori 1: Game Rising */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> A. Game Berstatus Rising (Tren Naik) — {risingGames.length} Game
          </h3>
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="leading-relaxed">
              Status <b>RISING</b> diberikan kepada game yang memiliki data komparabel pada periode sebelumnya dan menunjukkan pertumbuhan positif yang konsisten di seluruh indikator utama (views, komentar, serta cakupan kanal).
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-200">
              {risingGames.map((g) => (
                <li key={g.entity}>
                  <b className="capitalize">{g.entity}</b> (Skor Peluang: {g.opportunity_score} | Bukti: {g.evidence_level}): Mengalami kenaikan jangkauan penonton dari {g.previous_views.toLocaleString()} menjadi {g.recent_views.toLocaleString()} views (+{g.view_growth_pct?.toFixed(1)}%). Jumlah kanal aktif meningkat dari {g.previous_channels} menjadi {g.recent_channels} kanal.
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kategori 2: Game New (Rilis Baru / Emerging) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> B. Game Berstatus NEW / MIXED (Emerging & Tren Baru) — {newGames.length} Game
          </h3>
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="leading-relaxed">
              Status <b>NEW / MIXED</b> diberikan kepada game dengan pergerakan tren baru atau baru mendapatkan traksi besar di platform YouTube.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-200">
              {newGames.map((g) => (
                <li key={g.entity}>
                  <b className="capitalize">{g.entity}</b> (Jangkauan: {g.recent_views.toLocaleString()} views | {g.recent_videos} video di {g.recent_channels} kanal | Bukti: {g.evidence_level}): Skor Peluang {g.opportunity_score} poin. Rata-rata views per video: {g.avg_views_per_video.toLocaleString()}.
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kategori 3: Game Declining / Cooling */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" /> C. Game Berstatus Declining / Insufficient Data — {decliningGames.length} Game
          </h3>
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="leading-relaxed font-medium">
              <i>Catatan Penting:</i> Status <b>DECLINING / INSUFFICIENT DATA</b> merefleksikan pergerakan siklus pencarian pada jendela waktu tersebut, <u>bukan penilaian kualitas game secara keseluruhan</u>.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-200">
              {decliningGames.map((g) => (
                <li key={g.entity}>
                  <b className="capitalize">{g.entity}</b> ({g.recent_views.toLocaleString()} views | Status: {g.trend_status}): {g.view_growth_pct ? `Perubahan views: ${g.view_growth_pct.toFixed(1)}%` : 'Perlu sampel data tambahan'}.
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bagian 3: Penjelasan Metodologi Penyetaraan Sampel (Per-Video Average) */}
      <div className="glass-panel p-7 rounded-3xl space-y-4 border border-amber-500/30">
        <h2 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Zap className="w-5 h-5 text-amber-400" />
          3. Analisis Penyetaraan Sampel & Efisiensi Konten (Views / Video)
        </h2>
        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            Salah satu pertanyaan penting dalam analisis data ini adalah: <b>"Mengapa jumlah video per game tidak sama?"</b>
          </p>
          <p>
            Jawabannya: Algoritma pengambilan data YouTube bekerja secara <b>organik</b> mengikuti tren aktivitas pencarian dan kreator pada saat itu. Game yang sedang diperbincangkan atau baru rilis memancing lebih banyak video rilis dari berbagai kanal. Banyaknya jumlah video itu sendiri merupakan bagian dari <i>sinyal kepopuleran game</i>.
          </p>
          <p className="font-semibold text-amber-300">
            Untuk membandingkan performa antar-game secara setara dan adil tanpa terpengaruh oleh jumlah video, pipeline menghitung metrik <u>Rata-Rata Penonton per Video</u> (<i>avg_views_per_video</i>):
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 p-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Game</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Total Penonton</th>
                  <th className="p-2.5">Jumlah Video</th>
                  <th className="p-2.5 text-amber-400 font-bold">Rata-Rata Views / Video</th>
                  <th className="p-2.5">Evaluasi Efisiensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedByEfficiency.map((g) => (
                  <tr key={g.entity} className="hover:bg-slate-900/50">
                    <td className="p-2.5 font-bold text-white capitalize">{g.entity}</td>
                    <td className="p-2.5 text-slate-300">{g.trend_status}</td>
                    <td className="p-2.5 text-slate-300">{g.recent_views.toLocaleString()}</td>
                    <td className="p-2.5 text-slate-300">{g.recent_videos} video</td>
                    <td className="p-2.5 font-extrabold text-amber-300">
                      {g.avg_views_per_video.toLocaleString()} views/video
                    </td>
                    <td className="p-2.5 text-slate-400">
                      {g.avg_views_per_video >= 400000
                        ? '🔥 Sangat Tinggi'
                        : g.avg_views_per_video >= 150000
                        ? '📈 Tinggi'
                        : '⚖️ Moderat'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bagian 4: Kesimpulan & Rekomendasi Strategis */}
      <div className="glass-panel p-7 rounded-3xl space-y-4 border-l-4 border-l-cyan-500">
        <h2 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          4. Kesimpulan & Rekomendasi Tindak Lanjut
        </h2>
        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <b>Fokus Pengembangan Konten / Marketing:</b> Game seperti <b>Fortnite</b> dan <b>Silent Hill Townfall</b> menawarkan efisiensi jangkauan per video yang sangat massif (di atas 500k views/video). Konten yang dibuat untuk judul game ini memiliki potensi jangkauan tertinggi.
            </li>
            <li>
              <b>Fokus Peluang Momentum:</b> <b>PUBG</b> menunjukkan momentum pertumbuhan interaksi terkuat (+193.2% views & +241.1% komentar), menandakan minat komunitas penonton yang sedang berkembang pesat secara konsisten.
            </li>
            <li>
              <b>Pemantauan Kualitas Sampel:</b> Untuk game dengan sampel kanal tunggal (seperti <i>Undertale</i>), disarankan melakukan penambahan cakupan sampel video di iterasi pipeline berikutnya untuk validasi lebih mendalam.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
