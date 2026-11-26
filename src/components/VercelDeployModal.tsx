'use client';

import React, { useState } from 'react';
import { X, Check, Copy, Terminal, GitBranch } from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vercelCliCmd = 'npx vercel --prod';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(vercelCliCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Panduan Deploy ke Vercel"
    >
      <div
        className="bg-white w-full max-w-lg rounded-xl border border-zinc-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">Publikasi ke Vercel</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Langkah deploy aplikasi Next.js dashboard analitik
            </p>
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

        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2.5">
            <div className="flex items-center justify-between font-medium text-zinc-900">
              <span className="inline-flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                Opsi 1: Vercel CLI
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-white border border-zinc-200 text-zinc-600">
                Cepat
              </span>
            </div>
            <p className="text-zinc-600">
              Jalankan perintah berikut dari direktori{' '}
              <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-800">
                youtube-gaming-dashboard
              </code>
              :
            </p>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-[11px]">
              <span>{vercelCliCmd}</span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="font-medium text-zinc-900 inline-flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
              Opsi 2: Deploy Otomatis via GitHub
            </div>
            <ol className="list-decimal list-inside text-zinc-600 space-y-1.5">
              <li>Push perubahan terbaru ke repository GitHub proyek.</li>
              <li>
                Hubungkan repository di{' '}
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  vercel.com/new
                </a>
                .
              </li>
              <li>Vercel akan mendeteksi Next.js secara otomatis dan membangun ulang produksi.</li>
            </ol>
          </div>
        </div>

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
