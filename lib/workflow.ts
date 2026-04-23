import {
  ALLOWED_STATUS_TRANSITIONS,
  type RequestStatus,
} from "@/lib/constants";

export function canTransition(from: RequestStatus, to: RequestStatus) {
  return ALLOWED_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertTransition(from: RequestStatus, to: RequestStatus) {
  if (!canTransition(from, to)) {
    throw new Error(`Transition non autorisee: ${from} -> ${to}`);
  }
}

export function canPay(status: RequestStatus) {
  return status === "approved_for_payment";
}

export function canGenerateCertificate(status: RequestStatus) {
  return status === "payment_confirmed";
}
