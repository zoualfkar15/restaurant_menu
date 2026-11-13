import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authFetch } from '@/services/api';
import { useLocale } from '@/lib/locale';
import { useImageField } from '@/hooks/useImageField';
import Spinner from '@/components/Spinner';
import AppImage from '@/components/AppImage';
import { FormError, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '@/components/SiteForm';

export default function NewCategoryPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { fileInputRef, url: image, uploading, onFileChange, waitForImage } = useImageField();
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith('image/')) { setError(t('menu.pleaseSelectImage')); return; }
    setError('');
    try {
      await onFileChange(e);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const imageUrl = await waitForImage();
      const res = await authFetch('/admin/categories', { method: 'POST', body: JSON.stringify({ name, nameAr: nameAr || undefined, image: imageUrl || undefined }) });
      if (!res.ok) { setError((await res.json().catch(() => ({}))).message || t('menu.failedCreate')); return; }
      setSuccess(t('menu.successCreate'));
      setTimeout(() => navigate('/dashboard/menu'), 1200);
    } catch {
      setError(t('menu.failedCreate'));
    } finally {
      setSaving(false);
    }
  }

  const busy = saving || uploading;

  return (
    <div className="max-w-md rounded-[28px] bg-menu-surface-elevated p-6 shadow-menu-lg ring-1 ring-menu-border/80 sm:p-8">
      <Link to="/dashboard/menu" className="mb-4 inline-block text-sm font-bold text-primary-700 hover:text-primary-800">← {t('dashboard.menu')}</Link>
      <h1 className="mb-6 text-2xl font-extrabold text-menu-ink">{t('menu.newCategory')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && <p className="rounded-2xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800 ring-1 ring-primary-100">{success}</p>}
        <FormError>{error}</FormError>
        <div><label className={labelClass}>{t('menu.nameEn')}</label><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required /></div>
        <div><label className={labelClass}>{t('menu.nameAr')}</label><input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={inputClass} dir="rtl" /></div>
        <div>
          <label className={labelClass}>{t('menu.imageOptional')}</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-menu-ink-muted" />
          {uploading && <p className="mt-1 text-sm font-medium text-menu-ink-muted">{t('menu.uploading')}</p>}
          {image && <div className="mt-2 h-24 w-24 overflow-hidden rounded-2xl ring-1 ring-menu-border"><AppImage src={image} alt="" className="h-full w-full object-cover" width={96} height={96} /></div>}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busy} className={primaryButtonClass}>{busy && <Spinner />}{saving ? t('dashboard.creating') : uploading ? t('menu.uploading') : t('menu.createCategory')}</button>
          <Link to="/dashboard/menu" className={secondaryButtonClass}>{t('menu.cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
