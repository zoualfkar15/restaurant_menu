import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Client-side cart. Nothing here ever talks to the backend — the cart lives in
 * React state (Zustand) and is persisted to localStorage under `restaurant_cart`.
 *
 * Carts are keyed by restaurant slug so a customer can browse several
 * restaurants without their orders getting mixed together.
 */
export type CartItem = {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  price: number;
  image?: string | null;
  quantity: number;
};

export type CartProductInput = Omit<CartItem, 'quantity'>;

export type LastAdded = {
  id: string;
  name: string;
  nameAr?: string | null;
  at: number;
};

type CartState = {
  carts: Record<string, CartItem[]>;
  isOpen: boolean;
  lastAdded: LastAdded | null;
  setOpen: (open: boolean) => void;
  addItem: (restaurantSlug: string, item: CartProductInput, quantity?: number) => void;
  removeItem: (restaurantSlug: string, id: string) => void;
  setQuantity: (restaurantSlug: string, id: string, quantity: number) => void;
  clearCart: (restaurantSlug: string) => void;
};

export const CART_STORAGE_KEY = 'restaurant_cart';

const EMPTY: CartItem[] = [];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: {},
      isOpen: false,
      lastAdded: null,

      setOpen: (open) => set({ isOpen: open }),

      addItem: (restaurantSlug, item, quantity = 1) => {
        if (!restaurantSlug || quantity <= 0) return;
        const items = get().carts[restaurantSlug] ?? EMPTY;
        const existing = items.find((i) => i.id === item.id);
        const next = existing
          ? items.map((i) => (i.id === item.id ? { ...i, ...item, quantity: i.quantity + quantity } : i))
          : [...items, { ...item, quantity }];
        set((s) => ({
          carts: { ...s.carts, [restaurantSlug]: next },
          lastAdded: { id: item.id, name: item.name, nameAr: item.nameAr, at: Date.now() },
        }));
      },

      removeItem: (restaurantSlug, id) =>
        set((s) => {
          const items = s.carts[restaurantSlug] ?? EMPTY;
          return { carts: { ...s.carts, [restaurantSlug]: items.filter((i) => i.id !== id) } };
        }),

      setQuantity: (restaurantSlug, id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(restaurantSlug, id);
          return;
        }
        set((s) => {
          const items = s.carts[restaurantSlug] ?? EMPTY;
          return {
            carts: {
              ...s.carts,
              [restaurantSlug]: items.map((i) => (i.id === id ? { ...i, quantity } : i)),
            },
          };
        });
      },

      clearCart: (restaurantSlug) =>
        set((s) => {
          const { [restaurantSlug]: _removed, ...rest } = s.carts;
          void _removed;
          return { carts: rest };
        }),
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Only the cart contents are persisted; UI state (open drawer, toast) is not.
      partialize: (state) => ({ carts: state.carts }),
    },
  ),
);

export const selectCartItems = (restaurantSlug: string) => (s: CartState) => s.carts[restaurantSlug] ?? EMPTY;
