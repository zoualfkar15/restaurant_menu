import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore, selectCartItems, type CartItem, type CartProductInput } from '@/store/cartStore';

/**
 * Single cart API shared by every cart surface (product cards, mobile bar,
 * bottom-sheet drawer, desktop sidebar, WhatsApp checkout).
 *
 * The cart is scoped to a restaurant. Pass the slug explicitly, or omit it to
 * use the `:slug` route param of the current restaurant page.
 */
export function useCart(restaurantSlug?: string) {
  const params = useParams<{ slug: string }>();
  const slug = restaurantSlug ?? params.slug ?? '';

  const items = useCartStore(useMemo(() => selectCartItems(slug), [slug]));
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const addItemRaw = useCartStore((s) => s.addItem);
  const removeItemRaw = useCartStore((s) => s.removeItem);
  const setQuantityRaw = useCartStore((s) => s.setQuantity);
  const clearCartRaw = useCartStore((s) => s.clearCart);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100,
    [items],
  );

  const addItem = useCallback(
    (item: CartProductInput, quantity = 1) => addItemRaw(slug, item, quantity),
    [addItemRaw, slug],
  );
  const removeItem = useCallback((id: string) => removeItemRaw(slug, id), [removeItemRaw, slug]);
  const setQuantity = useCallback(
    (id: string, quantity: number) => setQuantityRaw(slug, id, quantity),
    [setQuantityRaw, slug],
  );
  const increaseQuantity = useCallback(
    (id: string) => {
      const current = selectCartItems(slug)(useCartStore.getState()).find((i) => i.id === id);
      if (current) setQuantityRaw(slug, id, current.quantity + 1);
    },
    [setQuantityRaw, slug],
  );
  const decreaseQuantity = useCallback(
    (id: string) => {
      const current = selectCartItems(slug)(useCartStore.getState()).find((i) => i.id === id);
      if (current) setQuantityRaw(slug, id, current.quantity - 1);
    },
    [setQuantityRaw, slug],
  );
  const clearCart = useCallback(() => clearCartRaw(slug), [clearCartRaw, slug]);
  const getQuantity = useCallback((id: string) => items.find((i) => i.id === id)?.quantity ?? 0, [items]);

  const openCart = useCallback(() => setOpen(true), [setOpen]);
  const closeCart = useCallback(() => setOpen(false), [setOpen]);

  return {
    restaurantSlug: slug,
    items,
    totalItems,
    totalPrice,
    isEmpty: items.length === 0,
    addItem,
    removeItem,
    setQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getQuantity,
    isOpen,
    openCart,
    closeCart,
  };
}

/**
 * Cart actions only — no subscription to cart contents. Use in components
 * rendered many times (menu cards) so they don't re-render on every change.
 */
export function useCartActions(restaurantSlug?: string) {
  const params = useParams<{ slug: string }>();
  const slug = restaurantSlug ?? params.slug ?? '';
  const addItemRaw = useCartStore((s) => s.addItem);
  const setQuantityRaw = useCartStore((s) => s.setQuantity);
  const removeItemRaw = useCartStore((s) => s.removeItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const addItem = useCallback(
    (item: CartProductInput, quantity = 1) => addItemRaw(slug, item, quantity),
    [addItemRaw, slug],
  );
  const changeQuantity = useCallback(
    (id: string, delta: number) => {
      const current = selectCartItems(slug)(useCartStore.getState()).find((i) => i.id === id);
      if (current) setQuantityRaw(slug, id, current.quantity + delta);
    },
    [setQuantityRaw, slug],
  );
  const increaseQuantity = useCallback((id: string) => changeQuantity(id, 1), [changeQuantity]);
  const decreaseQuantity = useCallback((id: string) => changeQuantity(id, -1), [changeQuantity]);
  const removeItem = useCallback((id: string) => removeItemRaw(slug, id), [removeItemRaw, slug]);
  const openCart = useCallback(() => setOpen(true), [setOpen]);
  const closeCart = useCallback(() => setOpen(false), [setOpen]);

  return { addItem, increaseQuantity, decreaseQuantity, removeItem, openCart, closeCart };
}

/** Subscribe to a single product's quantity only (keeps card re-renders minimal). */
export function useCartItemQuantity(id: string, restaurantSlug?: string): number {
  const params = useParams<{ slug: string }>();
  const slug = restaurantSlug ?? params.slug ?? '';
  return useCartStore((s) => (s.carts[slug] ?? []).find((i: CartItem) => i.id === id)?.quantity ?? 0);
}

/** Total number of items in the current restaurant's cart. */
export function useCartCount(restaurantSlug?: string): number {
  const params = useParams<{ slug: string }>();
  const slug = restaurantSlug ?? params.slug ?? '';
  return useCartStore((s) => (s.carts[slug] ?? []).reduce((sum: number, i: CartItem) => sum + i.quantity, 0));
}

export function useLastAdded() {
  return useCartStore((s) => s.lastAdded);
}
