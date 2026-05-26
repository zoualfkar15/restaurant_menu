'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import { useLocale } from '@/lib/locale';

export default function DashboardQRPage() {
  const { t } = useLocale();
  const [qr, setQr] = useState<{ url?: string; slug?: string } | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    authFetch('/admin/qr')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        setQr(data);
        if (data?.url) {
          import('qrcode').then((mod: { default?: { toDataURL: (u: string, o: object) => Promise<string> }; toDataURL?: (u: string, o: object) => Promise<string> }) => {
            const toDataURL = mod.default?.toDataURL ?? mod.toDataURL;
            if (typeof toDataURL !== 'function') {
              setQrError('Failed to load QR library');
              return;
            }
            toDataURL(data.url, { width: 256, margin: 2 })
              .then(setDataUrl)
              .catch(() => setQrError('Failed to generate QR image'));
          }).catch(() => setQrError('Failed to load QR library'));
        }
      })
      .catch(() => setQr(null));
  }, []);

  if (!qr) return <div className="p-4 text-slate-700 dark:text-slate-200">{t('dashboard.loading')}</div>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('qr.title')}</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">{t('qr.subtitle')}</p>
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg p-6 inline-block">
        {qrError && <p className="text-sm text-red-600 dark:text-red-400 mb-2">{qrError}</p>}
        {dataUrl ? (
          <img src={dataUrl} alt={t('qr.alt')} width={256} height={256} className="block" />
        ) : !qrError && qr?.url ? (
          <div className="w-64 h-64 flex items-center justify-center text-slate-400 dark:text-slate-500">{t('dashboard.loading')}</div>
        ) : null}
      </div>
      {qr?.url && (
        <>
          <p className="mt-4 text-slate-700 dark:text-slate-300 font-mono text-sm break-all">{qr.url}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('qr.printHint')}</p>
        </>
      )}
    </div>
  );
}
