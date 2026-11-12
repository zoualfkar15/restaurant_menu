import { memo, useState, type ReactNode } from 'react';
import { imageUrl } from '@/utils/imageUrl';
import type { MenuCategory } from '@/types/menu';
import { PlateIcon } from './icons';

export function categoryPhotoSrc(category: Pick<MenuCategory, 'image' | 'products'>): string | null {
  if (category.image) return category.image;
  return category.products?.find((product) => product.image)?.image ?? null;
}

type CategoryPhotoProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback?: ReactNode;
  loading?: 'lazy' | 'eager';
};

function CategoryPhoto({ src, alt = '', className = '', fallback, loading = 'lazy' }: CategoryPhotoProps) {
  const [failed, setFailed] = useState(false);
  const show = Boolean(src) && !failed;

  return (
    <span className={`relative block overflow-hidden bg-gradient-to-br from-menu-surface-muted via-white to-primary-50 ${className}`}>
      <span className="absolute inset-0 flex items-center justify-center text-primary-300">{fallback ?? <PlateIcon size={22} />}</span>
      {show && (
        <img
          src={imageUrl(src)}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          width={72}
          height={72}
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export default memo(CategoryPhoto);
