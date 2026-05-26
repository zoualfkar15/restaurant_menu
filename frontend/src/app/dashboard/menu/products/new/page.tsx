'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authFetch, authUploadFile } from '@/lib/api';
import { useLocale } from '@/lib/locale';
import Spinner from '@/components/Spinner';

type Category = { id: string; name: string };

export default function NewProductPage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategoryId = searchParams.get('categoryId') || '';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState(preselectedCategoryId);
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    authFetch('/admin/categories')
      .then((r) => r.ok ? r.json() : [])
      .then((list: Category[]) => {
        setCategories(list);
        if (preselectedCategoryId && !categoryId) setCategoryId(preselectedCategoryId);
      });
  }, [preselectedCategoryId]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('menu.pleaseSelectImage'));
      return;
    }
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
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError(t('menu.validPrice'));
      return;
    }
    if (!categoryId) {
      setError(t('menu.selectCategoryRequired'));
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await authFetch('/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          name,
          nameAr: nameAr || undefined,
          description: description || undefined,
          descriptionAr: descriptionAr || undefined,
          price: numPrice,
          categoryId,
          image: image || undefined,
          isAvailable,
          isPopular,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || t('menu.failedCreate'));
        return;
      }
      setSuccess(t('menu.successCreate'));
      setTimeout(() => router.push('/dashboard/menu'), 1200);
    } catch {
      setError(t('menu.failedCreate'));
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500';
  const labelClass = 'block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1';

  return (
    <div className="max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700">
      <Link href="/dashboard/menu" className="text-sm text-slate-600 dark:text-slate-400 hover:underline mb-4 inline-block">← {t('dashboard.menu')}</Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('menu.newProduct')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && <p className="text-sm px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200">{success}</p>}
        {error && <p className="text-sm px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200">{error}</p>}
        <div>
          <label className={labelClass}>{t('menu.nameEn')} *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>{t('menu.nameAr')}</label>
          <input
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className={inputClass}
            dir="rtl"
          />
        </div>
        <div>
          <label className={labelClass}>{t('dashboard.categories')} *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
            required
          >
            <option value="">{t('menu.selectCategory')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('menu.descriptionEn')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>{t('menu.descriptionAr')}</label>
          <textarea
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            className={inputClass}
            rows={2}
            dir="rtl"
          />
        </div>
        <div>
          <label className={labelClass}>{t('menu.price')} *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>{t('menu.imageOptional')}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="w-full text-slate-900 dark:text-slate-200 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white file:font-medium"
          />
          {uploading && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('menu.uploading')}</p>}
          {image && (
            <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 relative">
              <Image src={image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_URL || ''}${image}`} alt="" fill className="object-cover" sizes="96px" unoptimized={!image.startsWith('http')} />
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="rounded" />
            {t('menu.available')}
          </label>
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} className="rounded" />
            {t('menu.popular')}
          </label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-brand-600 disabled:opacity-50 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
            {saving && <Spinner className="w-4 h-4" />}
            {saving ? t('dashboard.creating') : t('menu.createProduct')}
          </button>
          <Link href="/dashboard/menu" className="border border-slate-300 dark:border-slate-600 px-4 py-2.5 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">{t('menu.cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
