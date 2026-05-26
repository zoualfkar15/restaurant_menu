import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

const API = process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? 'http://localhost:3001' : '');

async function getProduct(restaurantSlug: string, productSlug: string) {
  const res = await fetch(`${API}/api/restaurants/${restaurantSlug}/products/${productSlug}`, { next: { revalidate: 30 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; productSlug: string };
}) {
  const p = await getProduct(params.slug, params.productSlug);
  if (!p) return { title: 'Product not found' };
  const name = p.nameAr || p.name || '';
  const title = `${p.name || name} | ${p.restaurant?.name || p.restaurant?.nameAr || params.slug}`;
  return {
    title,
    description: p.description || p.descriptionAr || `View ${p.name || name} on our menu.`,
    openGraph: {
      title,
      description: p.description || p.descriptionAr || `View ${p.name || name} on our menu.`,
      images: p.image ? [p.image] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string; productSlug: string };
}) {
  const p = await getProduct(params.slug, params.productSlug);
  if (!p) notFound();

  return <ProductClient product={p} restaurantSlug={params.slug} />;
}
