import { STATUS_LABELS, type RequestStatus } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: RequestStatus | string }) {
  const tone =
    status === "certified" || status === "payment_confirmed" ? "green" :
    status === "rejected" || status === "revoked" ? "red" :
    status === "pending_documents" || status === "approved_for_payment" ? "amber" :
    status === "suspended" || status === "expired" ? "red" : "blue";

  return <Badge tone={tone}>{STATUS_LABELS[status as RequestStatus] ?? status}</Badge>;
}
