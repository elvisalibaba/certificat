export const ROLES = [
  "artisan",
  "inspector",
  "lab_agent",
  "admin",
] as const;

export const REQUEST_STATUSES = [
  "draft",
  "submitted",
  "under_admin_review",
  "pending_documents",
  "field_inspection_scheduled",
  "field_inspection_done",
  "lab_testing_scheduled",
  "lab_testing_done",
  "pending_decision",
  "approved_for_payment",
  "payment_pending",
  "payment_confirmed",
  "certified",
  "rejected",
  "suspended",
  "revoked",
  "expired",
] as const;

export const CERTIFICATE_STATUSES = [
  "valid",
  "suspended",
  "revoked",
  "expired",
] as const;

export const PAYMENT_STATUSES = [
  "created",
  "pending",
  "confirmed",
  "failed",
  "cancelled",
  "refunded",
] as const;

export const DEFAULT_CERTIFICATION_FEE = {
  amount: 50,
  currency: "USD",
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  draft: "Brouillon",
  submitted: "Soumis",
  under_admin_review: "Revue administrative",
  pending_documents: "Pieces demandees",
  field_inspection_scheduled: "Inspection planifiee",
  field_inspection_done: "Inspection terminee",
  lab_testing_scheduled: "Tests labo planifies",
  lab_testing_done: "Tests labo termines",
  pending_decision: "Decision attendue",
  approved_for_payment: "Paiement autorise",
  payment_pending: "Paiement en attente",
  payment_confirmed: "Paiement confirme",
  certified: "Certifie",
  rejected: "Rejete",
  suspended: "Suspendu",
  revoked: "Revoque",
  expired: "Expire",
};

export type Role = (typeof ROLES)[number];
export type RequestStatus = (typeof REQUEST_STATUSES)[number];
export type CertificateStatus = (typeof CERTIFICATE_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ALLOWED_STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  draft: ["submitted"],
  submitted: ["under_admin_review"],
  under_admin_review: ["pending_documents", "field_inspection_scheduled", "lab_testing_scheduled", "pending_decision", "rejected"],
  pending_documents: ["under_admin_review", "rejected"],
  field_inspection_scheduled: ["field_inspection_done"],
  field_inspection_done: ["lab_testing_scheduled", "pending_decision"],
  lab_testing_scheduled: ["lab_testing_done"],
  lab_testing_done: ["pending_decision"],
  pending_decision: ["approved_for_payment", "rejected"],
  approved_for_payment: ["payment_pending"],
  payment_pending: ["payment_confirmed"],
  payment_confirmed: ["certified"],
  certified: ["suspended", "revoked", "expired"],
  rejected: [],
  suspended: ["certified", "revoked", "expired"],
  revoked: [],
  expired: [],
};

export const ROLE_HOME: Record<Role, string> = {
  artisan: "/artisan/dashboard",
  inspector: "/inspector/dashboard",
  lab_agent: "/lab/dashboard",
  admin: "/admin/dashboard",
};
