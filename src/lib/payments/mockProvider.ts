import type { MockCheckoutSession } from './types';

interface CreateMockSessionInput {
  membershipId: string;
  membershipTitle: string;
  amountCents: number;
  customerName: string;
  customerEmail: string;
}

export function createMockSession(input: CreateMockSessionInput): MockCheckoutSession {
  return {
    id: 'mock_' + Math.random().toString(36).slice(2, 10),
    membershipId: input.membershipId,
    membershipTitle: input.membershipTitle,
    amountCents: input.amountCents,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    status: 'paid',
    createdAt: new Date().toISOString(),
  };
}

export function encodeSession(session: MockCheckoutSession): string {
  return encodeURIComponent(btoa(JSON.stringify(session)));
}

export function decodeSession(encoded: string): MockCheckoutSession | null {
  try {
    return JSON.parse(atob(decodeURIComponent(encoded)));
  } catch {
    return null;
  }
}
