import { mockPaymentProvider } from "@/lib/payments/mock-provider";
import type { PaymentProvider } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProvider {
  return mockPaymentProvider;
}
