import { notFound } from 'next/navigation';
import MenuViewTracker from './MenuViewTracker';
import MenuClient from './MenuClient';

const API = process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? 'http://localhost:3001' : '');

async function getMenu(slug: string) {
  const res = await fetch(`${API}/api/restaurants/${slug}/menu`, { next: { revalidate: 30 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const r = await getMenu(params.slug);
  if (!r) return { title: 'Menu not found' };
  const name = r.nameAr || r.name || '';
  return {
    title: `Menu | ${r.name || name}`,
    description: r.description || r.descriptionAr || `Browse the menu at ${r.name || name}.`,
    openGraph: {
      title: `Menu | ${r.name || name}`,
      description: r.description || r.descriptionAr || `Browse the menu at ${r.name || name}.`,
    },
  };
}

export default async function MenuPage({ params }: { params: { slug: string } }) {
  const r = await getMenu(params.slug);
  if (!r) notFound();

  return (
    <>
      <MenuViewTracker slug={params.slug} />
      <MenuClient restaurant={r} />
    </>
  );
}
