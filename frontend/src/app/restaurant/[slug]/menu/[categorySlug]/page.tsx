import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? 'http://localhost:3001' : '');

async function getMenu(slug: string) {
  const res = await fetch(`${API}/api/restaurants/${slug}/menu`, { next: { revalidate: 30 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; categorySlug: string };
}) {
  const r = await getMenu(params.slug);
  if (!r) return { title: 'Category not found' };
  const cat = (r.categories || []).find((c: { slug: string }) => c.slug === params.categorySlug);
  if (!cat) return { title: `${params.categorySlug} | ${r.name}` };
  return {
    title: `${cat.name} | ${r.name} Menu`,
    description: `Browse ${cat.name} at ${r.name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string; categorySlug: string };
}) {
  const r = await getMenu(params.slug);
  if (!r) notFound();
  const cat = (r.categories || []).find((c: { slug: string }) => c.slug === params.categorySlug);
  if (!cat) notFound();

  const category = cat as { name: string; image?: string | null; products: Array<{ id: string; name: string; slug: string; description: string | null; price: string | number; image: string | null; isPopular: boolean }> };
  const products = category.products || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3">
        <Link href={`/restaurant/${params.slug}/menu`} className="text-slate-600 text-sm">← Menu</Link>
        <div className="flex items-center gap-3 mt-2">
          {category.image && (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0 relative">
              <Image
                src={category.image.startsWith('http') ? category.image : `${API}${category.image}`}
                alt={category.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          )}
          <h1 className="text-xl font-bold text-slate-900">{category.name}</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <ul className="space-y-4">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/restaurant/${params.slug}/product/${p.slug}`}
                className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200"
              >
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  {p.image ? (
                    <Image src={p.image.startsWith('http') ? p.image : `${API}${p.image}`} alt={p.name} width={96} height={96} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl">🍽</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{p.name}</span>
                    {p.isPopular && <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded">Popular</span>}
                  </div>
                  {p.description && <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>}
                  <p className="text-brand-600 font-semibold mt-1">€{Number(p.price).toFixed(2)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
