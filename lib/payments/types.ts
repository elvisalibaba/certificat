export type PaymentIntentInput = {
  requestId: string;
  artisanId: string;
  amount: number;
  currency: string;
};

export type PaymentIntent = {
  provider: string;
  reference: string;
  status: "pending" | "confirmed" | "failed";
  checkoutUrl?: string;
  raw?: unknown;
};

export interface PaymentProvider {
  name: string;
  createIntent(input: PaymentIntentInput): Promise<PaymentIntent>;
  verify(reference: string): Promise<PaymentIntent>;
}
