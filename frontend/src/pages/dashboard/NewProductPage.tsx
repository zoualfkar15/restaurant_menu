import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authFetch, authUploadFile } from '@/services/api';
import { useLocale } from '@/lib/locale';
import Spinner from '@/components/Spinner';
import AppImage from '@/components/AppImage';
import { FormError, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '@/components/SiteForm';

type Category = { id: string; name: string };

export default function NewProductPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
    authFetch('/admin/categories').then((r) => r.ok ? r.json() : []).then((list: Category[]) => {
      setCategories(list);
      if (preselectedCategoryId) setCategoryId(preselectedCategoryId);
    });
  }, [preselectedCategoryId]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) { setError(t('menu.pleaseSelectImage')); return; }
    setUploading(true);
    try { setImage((await authUploadFile(file)).url); } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) { setError(t('menu.validPrice')); return; }
    if (!categoryId) { setError(t('menu.selectCategoryRequired')); return; }
    setSaving(true);
    setError('');
    try {
      const res = await authFetch('/admin/products', { method: 'POST', body: JSON.stringify({ name, nameAr: nameAr || undefined, description: description || undefined, descriptionAr: descriptionAr || undefined, price: numPrice, categoryId, image: image || undefined, isAvailable, isPopular }) });
      if (!res.ok) { setError((await res.json().catch(() => ({}))).message || t('menu.failedCreate')); return; }
      setSuccess(t('menu.successCreate'));
      setTimeout(() => navigate('/dashboard/menu'), 1200);
    } catch { setError(t('menu.failedCreate')); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-md rounded-[28px] bg-menu-surface-elevated p-6 shadow-menu-lg ring-1 ring-menu-border/80 sm:p-8">
      <Link to="/dashboard/menu" className="mb-4 inline-block text-sm font-bold text-primary-700 hover:text-primary-800">← {t('dashboard.menu')}</Link>
      <h1 className="mb-6 text-2xl font-extrabold text-menu-ink">{t('menu.newProduct')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && <p className="rounded-2xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800 ring-1 ring-primary-100">{success}</p>}
        <FormError>{error}</FormError>
        <div><label className={labelClass}>{t('menu.nameEn')} *</label><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required /></div>
        <div><label className={labelClass}>{t('menu.nameAr')}</label><input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={inputClass} dir="rtl" /></div>
        <div><label className={labelClass}>{t('dashboard.categories')} *</label><select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass} required><option value="">{t('menu.selectCategory')}</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className={labelClass}>{t('menu.descriptionEn')}</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} rows={2} /></div>
        <div><label className={labelClass}>{t('menu.descriptionAr')}</label><textarea value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} className={inputClass} rows={2} dir="rtl" /></div>
        <div><label className={labelClass}>{t('menu.price')} *</label><input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} required /></div>
        <div><label className={labelClass}>{t('menu.imageOptional')}</label><input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-menu-ink-muted" />{uploading && <p className="mt-1 text-sm font-medium text-menu-ink-muted">{t('menu.uploading')}</p>}{image && <div className="mt-2 h-24 w-24 overflow-hidden rounded-2xl ring-1 ring-menu-border"><AppImage src={image} alt="" className="h-full w-full object-cover" width={96} height={96} /></div>}</div>
        <div className="flex gap-4 text-sm font-semibold text-menu-ink"><label className="flex items-center gap-2"><input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />{t('menu.available')}</label><label className="flex items-center gap-2"><input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />{t('menu.popular')}</label></div>
        <div className="flex flex-wrap gap-3"><button type="submit" disabled={saving} className={primaryButtonClass}>{saving && <Spinner />}{saving ? t('dashboard.creating') : t('menu.createProduct')}</button><Link to="/dashboard/menu" className={secondaryButtonClass}>{t('menu.cancel')}</Link></div>
      </form>
    </div>
  );
}
