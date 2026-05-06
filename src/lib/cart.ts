export interface CartItem {
  id: string;
  title: string;
  priceCents: number;
  type: 'one_time' | 'merch';
  quantity: number;
}

const CART_KEY = 'bhb_cart';

export function getCart(): CartItem[] {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
    return items.map((item: CartItem) => ({ ...item, quantity: item.quantity ?? 1 }));
  } catch {
    return [];
  }
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({ ...item });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeFromCart(id: string): void {
  const updated = getCart().filter((i) => i.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(updated));
}

export function clearCart(): void {
  localStorage.setItem(CART_KEY, '[]');
}

export function isInCart(id: string): boolean {
  return getCart().some((i) => i.id === id);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}
