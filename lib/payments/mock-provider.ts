import type { PaymentIntentInput, PaymentProvider } from "@/lib/payments/types";

export const mockPaymentProvider: PaymentProvider = {
  name: "mock",
  async createIntent(input: PaymentIntentInput) {
    return {
      provider: "mock",
      reference: `MOCK-${input.requestId.slice(0, 8)}-${Date.now()}`,
      status: "pending",
      checkoutUrl: `/artisan/payments?request=${input.requestId}`,
      raw: { mode: "development", country: "RDC", channel: "mobile_money", operators: ["Airtel Money", "Orange Money", "M-Pesa", "Afrimoney"] },
    };
  },
  async verify(reference: string) {
    return {
      provider: "mock",
      reference,
      status: "confirmed",
      raw: { verified: true, country: "RDC", channel: "mobile_money" },
    };
  },
};
