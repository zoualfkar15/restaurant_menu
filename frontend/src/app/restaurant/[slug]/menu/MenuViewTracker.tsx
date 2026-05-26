'use client';

import { useEffect } from 'react';

export default function MenuViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${base}/api/restaurants/${slug}/menu/view`, { method: 'POST' }).catch(() => {});
  }, [slug]);
  return null;
}
