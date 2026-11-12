import { useEffect, useState } from 'react';
import { authFetch } from '@/services/api';
import { useLocale } from '@/lib/locale';

export default function QRPage() {
  const { t } = useLocale();
  const [qr, setQr] = useState<{ url?: string; slug?: string } | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    authFetch('/admin/qr').then((r) => r.ok ? r.json() : null).then((data) => {
      setQr(data);
      if (data?.url) {
        import('qrcode').then((mod) => {
          const toDataURL = mod.default?.toDataURL ?? mod.toDataURL;
          if (typeof toDataURL !== 'function') { setQrError('Failed to load QR library'); return; }
          toDataURL(data.url, { width: 256, margin: 2 }).then(setDataUrl).catch(() => setQrError('Failed to generate QR image'));
        }).catch(() => setQrError('Failed to load QR library'));
      }
    }).catch(() => setQr(null));
  }, []);

  if (!qr) return <p className="font-semibold text-menu-ink-muted">{t('dashboard.loading')}</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-extrabold text-menu-ink">{t('qr.title')}</h1>
      <p className="mb-6 mt-2 text-menu-ink-muted">{t('qr.subtitle')}</p>
      <div className="inline-block rounded-[22px] bg-menu-surface-elevated p-6 shadow-menu-md ring-1 ring-menu-border">
        {qrError && <p className="mb-2 text-sm font-semibold text-red-700">{qrError}</p>}
        {dataUrl ? <img src={dataUrl} alt={t('qr.alt')} width={256} height={256} className="block" /> : !qrError && qr?.url ? <div className="flex h-64 w-64 items-center justify-center font-semibold text-menu-ink-muted">{t('dashboard.loading')}</div> : null}
      </div>
      {qr?.url && (<><p className="mt-4 break-all font-mono text-sm text-menu-ink">{qr.url}</p><p className="mt-2 text-sm text-menu-ink-muted">{t('qr.printHint')}</p></>)}
    </div>
  );
}
