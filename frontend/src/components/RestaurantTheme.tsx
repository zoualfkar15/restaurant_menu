import type { CSSProperties, ReactNode } from 'react';
import { restaurantThemeStyle } from '@/lib/restaurantTheme';

/** Applies a restaurant primary palette via CSS variables (`--primary-*`). */
export default function RestaurantTheme({
  color,
  loading = false,
  className = '',
  children,
}: {
  color?: string | null;
  loading?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const style = restaurantThemeStyle({ loading, color }) as CSSProperties | undefined;
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
