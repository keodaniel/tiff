export type PaymentProvider = 'mock' | 'stripe';
export type CheckoutStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface MockCheckoutSession {
  id: string;
  membershipId: string;
  membershipTitle: string;
  amountCents: number;
  customerName: string;
  customerEmail: string;
  status: CheckoutStatus;
  createdAt: string;
}
