import { notFound } from 'next/navigation';
import RestaurantLandingClient from './RestaurantLandingClient';

const API = process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? 'http://localhost:3001' : '');

async function getRestaurant(slug: string) {
  const res = await fetch(`${API}/api/restaurants/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const r = await getRestaurant(params.slug);
  if (!r) return { title: 'Restaurant not found' };
  const name = r.nameAr || r.name || '';
  return {
    title: `${r.name || name} | Menu & Contact`,
    description: r.description || r.descriptionAr || `Visit ${r.name || name} and view our menu online.`,
    openGraph: {
      title: `${r.name || name} | Menu & Contact`,
      description: r.description || r.descriptionAr || `Visit ${r.name || name} and view our menu online.`,
      images: r.coverImage ? [r.coverImage] : [],
    },
  };
}

export default async function RestaurantLandingPage({ params }: { params: { slug: string } }) {
  const r = await getRestaurant(params.slug);
  if (!r) notFound();

  const lat = r.latitude != null ? Number(r.latitude) : null;
  const lng = r.longitude != null ? Number(r.longitude) : null;
  const hasGeo = lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng);
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    ...(r.description && { description: r.description }),
    ...(r.phone && { telephone: r.phone }),
    ...(r.address && { address: { '@type': 'PostalAddress', streetAddress: r.address } }),
    ...(hasGeo && { geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RestaurantLandingClient restaurant={r} />
    </>
  );
}
