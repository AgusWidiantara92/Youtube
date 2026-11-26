'use client';

import React from 'react';
import { GameRecord, KpiSummary } from '@/types/gaming';

interface DetailedReportTabProps {
  records: GameRecord[];
  kpi: KpiSummary;
  version?: string;
}

export const DetailedReportTab: React.FC<DetailedReportTabProps> = ({
  records,
  version = '3.8.39 ID',
}) => {
  const risingGames = records
    .filter((r) => r.trend_status === 'RISING')
    .sort((a, b) => b.opportunity_score - a.opportunity_score);
  const newGames = records
    .filter((r) => r.trend_status === 'NEW')
    .sort((a, b) => b.recent_views - a.recent_views);
  const decliningGames = records.filter(
    (r) => r.trend_status === 'DECLINING' || r.trend_status === 'INSUFFICIENT_DATA'
  );

  const sortedByEfficiency = [...records].sort(
    (a, b) => b.avg_views_per_video - a.avg_views_per_video
  );
  const topEfficiency = sortedByEfficiency[0];
  const secondEfficiency = sortedByEfficiency[1];
  const singleChannelGames = records.filter((r) => r.recent_channels <= 1);

  return (
    <article className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] divide-y divide-zinc-200">
      {/* Document Header */}
      <header className="p-6 sm:p-8">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
          Laporan Analisis Eksekutif · Pipeline v{version}
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-950 tracking-tight mb-3">
          Analisis Tren Deskriptif dan Performa Interaksi YouTube Gaming Indonesia
        </h1>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Dokumen ini merangkum hasil olahan data{' '}
          <strong className="font-medium text-zinc-900">
            YouTube Gaming Analytics Pipeline v{version}
          </strong>{' '}
          yang mengevaluasi{' '}
          <strong className="font-medium text-zinc-900">{records.length} entitas game utama</strong>{' '}
          berdasarkan sinyal momentum pertumbuhan, jangkauan popularitas, kualitas keterlibatan
          penonton, serta efisiensi penayangan per video.
        </p>
      </header>

      {/* Section 1: Executive Highlights */}
      <section className="p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider">
          1. Ringkasan Temuan Utama
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {risingGames.length > 0 && (
            <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-700">
                  Pemimpin Momentum (Naik)
                </span>
                <span className="font-semibold text-zinc-950 capitalize">
                  {risingGames[0].entity}
                </span>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                <strong className="text-zinc-900 capitalize">{risingGames[0].entity}</strong>{' '}
                mencatatkan performa terkuat dengan pertumbuhan penonton{' '}
                <strong className="font-mono text-emerald-700">
                  +{risingGames[0].view_growth_pct?.toFixed(1)}%
                </strong>{' '}
                (dari {risingGames[0].previous_views.toLocaleString('id-ID')} menjadi{' '}
                {risingGames[0].recent_views.toLocaleString('id-ID')} views) dan Skor Peluang{' '}
                <strong className="font-mono text-zinc-900">
                  {risingGames[0].opportunity_score} poin
                </strong>
                .
              </p>
            </div>
          )}

          {topEfficiency && (
            <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                  Efisiensi Konten Teratas
                </span>
                <span className="font-semibold text-zinc-950 capitalize">
                  {topEfficiency.entity}
                </span>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                Secara rata-rata penonton per video (penyetaraan sampel),{' '}
                <strong className="text-zinc-900 capitalize">{topEfficiency.entity}</strong>{' '}
                meraih efisiensi tertinggi sebesar{' '}
                <strong className="font-mono text-zinc-900">
                  {Math.round(topEfficiency.avg_views_per_video).toLocaleString('id-ID')} views/video
                </strong>{' '}
                dari sampel {topEfficiency.recent_videos} video.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Segmentation by Trend Status */}
      <section className="p-6 sm:p-8 space-y-5">
        <h2 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider">
          2. Segmentasi Berdasarkan Status Tren
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <h3 className="font-semibold text-emerald-700 mb-2">
              A. Kategori Naik / Rising ({risingGames.length} game)
            </h3>
            <p className="text-zinc-600 leading-relaxed mb-2">
              Status <strong className="text-zinc-900">RISING</strong> diberikan kepada entitas
              yang memiliki data pembanding pada periode sebelumnya dan mencatat pertumbuhan
              positif pada penayangan, komentar, serta cakupan kanal.
            </p>
            {risingGames.length > 0 ? (
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-700">
                {risingGames.map((g) => (
                  <li key={g.entity} className="leading-relaxed">
                    <strong className="capitalize text-zinc-950">{g.entity}</strong> (Skor Peluang{' '}
                    <span className="font-mono">{g.opportunity_score}</span>, Bukti {g.evidence_level}
                    ): penayangan meningkat dari {g.previous_views.toLocaleString('id-ID')} menjadi{' '}
                    {g.recent_views.toLocaleString('id-ID')} views (+{g.view_growth_pct?.toFixed(1)}
                    %), dengan kanal aktif berubah dari {g.previous_channels} menjadi{' '}
                    {g.recent_channels} kanal.
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 italic">Tidak ada game pada kategori ini.</p>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-100">
            <h3 className="font-semibold text-blue-700 mb-2">
              B. Kategori Baru / New ({newGames.length} game)
            </h3>
            <p className="text-zinc-600 leading-relaxed mb-2">
              Status <strong className="text-zinc-900">NEW</strong> diberikan kepada game yang baru
              muncul atau mulai memperoleh traksi signifikan pada periode pengamatan berjalan.
            </p>
            {newGames.length > 0 ? (
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-700">
                {newGames.map((g) => (
                  <li key={g.entity} className="leading-relaxed">
                    <strong className="capitalize text-zinc-950">{g.entity}</strong> (
                    {g.recent_views.toLocaleString('id-ID')} views dari {g.recent_videos} video pada{' '}
                    {g.recent_channels} kanal): Skor Peluang{' '}
                    <span className="font-mono">{g.opportunity_score}</span> poin dengan rata-rata{' '}
                    {Math.round(g.avg_views_per_video).toLocaleString('id-ID')} views/video.
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 italic">Tidak ada game pada kategori ini.</p>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-100">
            <h3 className="font-semibold text-rose-700 mb-2">
              C. Kategori Menurun / Data Kurang ({decliningGames.length} game)
            </h3>
            <p className="text-zinc-600 leading-relaxed mb-2">
              Status <strong className="text-zinc-900">DECLINING</strong> merefleksikan perlambatan
              siklus pencarian pada jendela waktu pengamatan, bukan penilaian kualitas game secara
              keseluruhan.
            </p>
            {decliningGames.length > 0 ? (
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-700">
                {decliningGames.map((g) => (
                  <li key={g.entity} className="leading-relaxed">
                    <strong className="capitalize text-zinc-950">{g.entity}</strong> (
                    {g.recent_views.toLocaleString('id-ID')} views, status {g.trend_status}):{' '}
                    {g.view_growth_pct !== null
                      ? `perubahan penayangan ${g.view_growth_pct.toFixed(1)}%`
                      : 'memerlukan sampel pembanding tambahan'}
                    .
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 italic">Tidak ada game pada kategori ini.</p>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Sample Normalization & Efficiency Table */}
      <section className="p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider">
          3. Penyetaraan Sampel dan Efisiensi Konten (Views / Video)
        </h2>
        <p className="text-xs text-zinc-600 leading-relaxed">
          Jumlah video per entitas berbeda secara organik mengikuti intensitas unggahan kreator
          pada periode pengamatan. Untuk membandingkan performa secara adil tanpa bias volume
          unggahan, pipeline menghitung metrik rata-rata penonton per video (
          <code className="font-mono text-[11px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">
            avg_views_per_video
          </code>
          ):
        </p>

        <div className="overflow-x-auto border border-zinc-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 text-[11px] uppercase tracking-wider border-b border-zinc-200">
                <th className="py-2.5 px-3 font-medium">Game</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-3 font-medium text-right">Total Penonton</th>
                <th className="py-2.5 px-3 font-medium text-right">Video</th>
                <th className="py-2.5 px-3 font-medium text-right">Views / Video</th>
                <th className="py-2.5 px-3 font-medium">Kategori Efisiensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {sortedByEfficiency.map((g) => {
                const effLabel =
                  g.avg_views_per_video >= 400_000
                    ? { text: 'Sangat Tinggi', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                    : g.avg_views_per_video >= 150_000
                    ? { text: 'Tinggi', cls: 'bg-blue-50 text-blue-700 border-blue-200' }
                    : { text: 'Moderat', cls: 'bg-zinc-100 text-zinc-600 border-zinc-200' };
                return (
                  <tr key={g.entity} className="hover:bg-zinc-50/70">
                    <td className="py-2.5 px-3 font-medium text-zinc-950 capitalize">{g.entity}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-600">
                      {g.trend_status}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-700 tabular-nums">
                      {g.recent_views.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-600 tabular-nums">
                      {g.recent_videos}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-zinc-950 tabular-nums">
                      {Math.round(g.avg_views_per_video).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded border ${effLabel.cls}`}
                      >
                        {effLabel.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Dynamic Strategic Conclusions */}
      <section className="p-6 sm:p-8 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider">
          4. Kesimpulan dan Rekomendasi Tindak Lanjut
        </h2>
        <ul className="space-y-2 pl-4 list-disc text-xs text-zinc-700 leading-relaxed">
          {topEfficiency && (
            <li>
              <strong className="text-zinc-950">Fokus Efisiensi Jangkauan Konten:</strong>{' '}
              <span className="capitalize font-medium text-zinc-900">{topEfficiency.entity}</span>
              {secondEfficiency ? (
                <>
                  {' '}
                  dan{' '}
                  <span className="capitalize font-medium text-zinc-900">
                    {secondEfficiency.entity}
                  </span>
                </>
              ) : null}{' '}
              menunjukkan efisiensi jangkauan per video tertinggi (hingga{' '}
              <span className="font-mono font-medium">
                {Math.round(topEfficiency.avg_views_per_video).toLocaleString('id-ID')} views/video
              </span>
              ), sehingga potensial dijadikan acuan gaya konten dan genre pasar.
            </li>
          )}
          {risingGames.length > 0 && (
            <li>
              <strong className="text-zinc-950">Fokus Peluang Momentum:</strong>{' '}
              <span className="capitalize font-medium text-zinc-900">{risingGames[0].entity}</span>{' '}
              memimpin pertumbuhan interaksi (+{risingGames[0].view_growth_pct?.toFixed(1)}%
              penayangan), menandakan minat komunitas penonton yang sedang bertumbuh aktif.
            </li>
          )}
          <li>
            <strong className="text-zinc-950">Validasi Kualitas Sampel:</strong>{' '}
            {singleChannelGames.length > 0
              ? `Entitas dengan cakupan kanal terbatas (${singleChannelGames
                  .map((g) => g.entity)
                  .join(', ')}) disarankan memperoleh pemantauan tambahan pada iterasi pipeline berikutnya untuk meningkatkan keandalan estimasi tren.`
              : 'Seluruh entitas utama telah memiliki cakupan lebih dari satu kanal aktif sehingga estimasi tren lintas kreator lebih stabil.'}
          </li>
        </ul>
      </section>
    </article>
  );
};
