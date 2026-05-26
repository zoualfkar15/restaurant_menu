'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authFetch, authUploadFile } from '@/lib/api';
import { useLocale } from '@/lib/locale';
import Spinner from '@/components/Spinner';

export default function EditCategoryPage() {
  const { t } = useLocale();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    authFetch(`/admin/categories/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((cat) => {
        if (cat) {
          setName(cat.name);
          setNameAr(cat.nameAr || '');
          setImage(cat.image || '');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const { url } = await authUploadFile(file);
      setImage(url);
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
      const res = await authFetch(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, nameAr: nameAr || undefined, image: image || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || t('menu.failedSave'));
        return;
      }
      setSuccess(t('menu.successSave'));
      setTimeout(() => router.push('/dashboard/menu'), 1200);
    } catch {
      setError(t('menu.failedSave'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-4 text-slate-900">{t('dashboard.loading')}</div>;

  return (
    <div>
      <Link href="/dashboard/menu" className="text-sm text-slate-500 hover:underline mb-4 inline-block">← {t('dashboard.menu')}</Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{t('menu.editCategory')}</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {success && <p className="text-sm px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200">{success}</p>}
        {error && <p className="text-sm px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('menu.nameEn')}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('menu.nameAr')}</label>
          <input
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('menu.imageOptional')}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="w-full text-slate-900 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white file:font-medium"
          />
          {uploading && <p className="text-sm text-slate-500 mt-1">{t('menu.uploading')}</p>}
          {image && (
            <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden bg-slate-100 relative">
              <Image
                src={image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_URL || ''}${image}`}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
                unoptimized={!image.startsWith('http')}
              />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600 disabled:opacity-50">
            {saving && <Spinner className="w-4 h-4" />}
            {saving ? t('menu.saving') : t('menu.save')}
          </button>
          <Link href="/dashboard/menu" className="border border-slate-300 px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-50">{t('menu.cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
