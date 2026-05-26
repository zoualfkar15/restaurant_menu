import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authFetch, authUploadFile } from '@/services/api';
import { useLocale } from '@/lib/locale';
import Spinner from '@/components/Spinner';
import AppImage from '@/components/AppImage';

export default function EditProductPage() {
  const { t } = useLocale();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!id) return;
    authFetch(`/admin/products/${id}`).then((r) => r.ok ? r.json() : null).then((p) => {
      if (p) {
        setName(p.name); setNameAr(p.nameAr || ''); setDescription(p.description || ''); setDescriptionAr(p.descriptionAr || '');
        setPrice(String(p.price ?? '')); setCategoryId(p.categoryId || ''); setImage(p.image || '');
        setIsAvailable(p.isAvailable !== false); setIsPopular(p.isPopular === true);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    setUploading(true);
    try { setImage((await authUploadFile(file)).url); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) { setError(t('menu.validPrice')); return; }
    setSaving(true);
    setError('');
    try {
      const res = await authFetch(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify({ name, nameAr: nameAr || undefined, description: description || undefined, descriptionAr: descriptionAr || undefined, price: numPrice, categoryId: categoryId || undefined, image: image || undefined, isAvailable, isPopular }) });
      if (!res.ok) { setError((await res.json().catch(() => ({}))).message || t('menu.failedSave')); return; }
      setSuccess(t('menu.successSave'));
      setTimeout(() => navigate('/dashboard/menu'), 1200);
    } catch { setError(t('menu.failedSave')); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="p-4">{t('dashboard.loading')}</div>;

  return (
    <div>
      <Link to="/dashboard/menu" className="text-sm text-slate-500 hover:underline mb-4 inline-block">← {t('dashboard.menu')}</Link>
      <h1 className="text-2xl font-bold mb-6">{t('menu.editProduct')}</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {success && <p className="text-sm px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800">{success}</p>}
        {error && <p className="text-sm px-3 py-2 rounded-lg bg-red-100 text-red-700">{error}</p>}
        <div><label className="block text-sm font-medium mb-1">{t('menu.nameEn')} *</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white" required /></div>
        <div><label className="block text-sm font-medium mb-1">{t('menu.nameAr')}</label><input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white" dir="rtl" /></div>
        <div><label className="block text-sm font-medium mb-1">{t('menu.descriptionEn')}</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white" rows={2} /></div>
        <div><label className="block text-sm font-medium mb-1">{t('menu.descriptionAr')}</label><textarea value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white" rows={2} dir="rtl" /></div>
        <div><label className="block text-sm font-medium mb-1">{t('menu.price')} *</label><input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white" required /></div>
        <div><label className="block text-sm font-medium mb-1">{t('menu.imageOptional')}</label><input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" />{uploading && <p className="text-sm text-slate-500 mt-1">{t('menu.uploading')}</p>}{image && <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden"><AppImage src={image} alt="" className="w-full h-full object-cover" width={96} height={96} /></div>}</div>
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />{t('menu.available')}</label><label className="flex items-center gap-2"><input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />{t('menu.popular')}</label></div>
        <div className="flex gap-3"><button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50">{saving && <Spinner />}{saving ? t('menu.saving') : t('menu.save')}</button><Link to="/dashboard/menu" className="border border-slate-300 px-4 py-2 rounded-lg">{t('menu.cancel')}</Link></div>
      </form>
    </div>
  );
}
