import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  price: number;
  image?: string | null;
  quantity: number;
};

type CartState = {
  restaurantSlug: string | null;
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (restaurantSlug: string, item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantSlug: null,
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      addItem: (restaurantSlug, item, quantity = 1) => {
        const state = get();
        if (state.restaurantSlug && state.restaurantSlug !== restaurantSlug) {
          set({ restaurantSlug, items: [{ ...item, quantity }] });
          return;
        }
        const existing = state.items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            restaurantSlug,
            items: state.items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          });
        } else {
          set({ restaurantSlug, items: [...state.items, { ...item, quantity }] });
        }
      },
      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }));
      },
      clearCart: () => set({ items: [], restaurantSlug: null }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'menuqr-cart' },
  ),
);
