'use client';

import React from 'react';
import { BarChart3, Search, Download, UploadCloud, X } from 'lucide-react';

interface HeaderProps {
  version?: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenDeployModal: () => void;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  version = 'v3.8.39 ID',
  searchTerm,
  setSearchTerm,
  onOpenDeployModal,
  onExportCsv,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-[15px] font-semibold text-zinc-950 tracking-tight truncate">
                Pusat Analitik Trend YouTube Gaming
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-zinc-100 text-zinc-700 border border-zinc-200 shrink-0">
                {version}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 truncate">
              PT Pandora Digital Entertainment · Region Indonesia
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative hidden md:block w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari judul game..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 rounded-lg transition-colors cursor-pointer"
            title="Unduh dataset olahan dalam format CSV"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenDeployModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors cursor-pointer"
            title="Panduan publikasi ke Vercel"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Deploy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
