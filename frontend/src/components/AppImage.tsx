import { memo, useState } from 'react';
import { imageUrl } from '@/utils/imageUrl';

type AppImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
};

function AppImage({ src, alt, className = '', width, height, loading = 'lazy' }: AppImageProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <img
      src={imageUrl(src)}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export default memo(AppImage);
