import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authFetch, authUploadFile } from '@/services/api';
import { useLocale } from '@/lib/locale';
import Spinner from '@/components/Spinner';
import AppImage from '@/components/AppImage';

export default function NewCategoryPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) { setError(t('menu.pleaseSelectImage')); return; }
    setError('');
    setUploading(true);
    try {
      const { url } = await authUploadFile(file);
      setImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await authFetch('/admin/categories', { method: 'POST', body: JSON.stringify({ name, nameAr: nameAr || undefined, image: image || undefined }) });
      if (!res.ok) { setError((await res.json().catch(() => ({}))).message || t('menu.failedCreate')); return; }
      setSuccess(t('menu.successCreate'));
      setTimeout(() => navigate('/dashboard/menu'), 1200);
    } catch {
      setError(t('menu.failedCreate'));
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500';

  return (
    <div className="max-w-md p-6 rounded-2xl bg-white shadow border border-slate-200">
      <Link to="/dashboard/menu" className="text-sm text-slate-600 hover:underline mb-4 inline-block">← {t('dashboard.menu')}</Link>
      <h1 className="text-2xl font-bold mb-6">{t('menu.newCategory')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && <p className="text-sm px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800">{success}</p>}
        {error && <p className="text-sm px-3 py-2 rounded-lg bg-red-100 text-red-700">{error}</p>}
        <div><label className="block text-sm font-medium mb-1">{t('menu.nameEn')}</label><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required /></div>
        <div><label className="block text-sm font-medium mb-1">{t('menu.nameAr')}</label><input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={inputClass} dir="rtl" /></div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('menu.imageOptional')}</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" />
          {uploading && <p className="text-sm text-slate-500 mt-1">{t('menu.uploading')}</p>}
          {image && <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden"><AppImage src={image} alt="" className="w-full h-full object-cover" width={96} height={96} /></div>}
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50">{saving && <Spinner />}{saving ? t('dashboard.creating') : t('menu.createCategory')}</button>
          <Link to="/dashboard/menu" className="border border-slate-300 px-4 py-2 rounded-lg">{t('menu.cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
