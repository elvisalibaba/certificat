import { createClient } from "@/lib/supabase/server";
import type { RequestStatus } from "@/lib/constants";

type QueryLike = PromiseLike<{ data?: unknown; count?: number | null }> & {
  eq(column: string, value: unknown): QueryLike;
  in(column: string, values: readonly unknown[]): QueryLike;
  not(column: string, operator: string, value: unknown): QueryLike;
  gte(column: string, value: unknown): QueryLike;
  order(column: string, options?: { ascending?: boolean }): QueryLike;
  limit(count: number): QueryLike;
};

async function safeCount(
  table: string,
  filters?: (query: QueryLike) => QueryLike,
) {
  try {
    const supabase = await createClient();
    let query = supabase.from(table).select("*", { count: "exact", head: true }) as unknown as QueryLike;
    if (filters) {
      query = filters(query);
    }
    const { count } = await query;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function safeRows<T>(
  table: string,
  select: string,
  filters?: (query: QueryLike) => QueryLike,
): Promise<T[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from(table).select(select) as unknown as QueryLike;
    if (filters) {
      query = filters(query);
    }
    const { data } = await query;
    return (data ?? []) as T[];
  } catch {
    return [];
  }
}

export async function getAdminDashboardData() {
  const [
    artisans,
    submittedProducts,
    pendingRequests,
    upcomingInspections,
    pendingPayments,
    issuedCertificates,
    suspendedCertificates,
    revokedCertificates,
    expiredCertificates,
    recentRequests,
  ] = await Promise.all([
    safeCount("profiles", (q) => q.eq("role", "artisan")),
    safeCount("products", (q) => q.eq("submission_state", "submitted")),
    safeCount("certification_requests", (q) =>
      q.in("status", ["submitted", "under_admin_review", "pending_documents", "pending_decision"]),
    ),
    safeCount("inspection_missions", (q) => q.eq("status", "scheduled").gte("scheduled_at", new Date().toISOString())),
    safeCount("payment_transactions", (q) => q.in("status", ["created", "pending"])),
    safeCount("certificates"),
    safeCount("certificates", (q) => q.eq("status", "suspended")),
    safeCount("certificates", (q) => q.eq("status", "revoked")),
    safeCount("certificates", (q) => q.eq("status", "expired")),
    safeRows<{
      id: string;
      status: RequestStatus;
      request_number: string | null;
      created_at: string;
      products: { name: string; category: string } | null;
    }>("certification_requests", "id,status,request_number,created_at,products(name,category)", (q) =>
      q.order("created_at", { ascending: false }).limit(5),
    ),
  ]);

  return {
    artisans,
    submittedProducts,
    pendingRequests,
    upcomingInspections,
    pendingPayments,
    issuedCertificates,
    suspendedCertificates,
    revokedCertificates,
    expiredCertificates,
    recentRequests,
  };
}

export async function getArtisanDashboardData(artisanId: string) {
  const [products, activeRequests, paymentReady, certificates, recentRequests] = await Promise.all([
    safeCount("products", (q) => q.eq("artisan_id", artisanId)),
    safeCount("certification_requests", (q) =>
      q.eq("artisan_id", artisanId).not("status", "in", "(certified,rejected,revoked,expired)"),
    ),
    safeCount("certification_requests", (q) => q.eq("artisan_id", artisanId).eq("status", "approved_for_payment")),
    safeCount("certificates", (q) => q.eq("artisan_id", artisanId)),
    safeRows<{
      id: string;
      status: RequestStatus;
      request_number: string | null;
      products: { name: string; category: string } | null;
    }>("certification_requests", "id,status,request_number,products(name,category)", (q) =>
      q.eq("artisan_id", artisanId).order("created_at", { ascending: false }).limit(5),
    ),
  ]);

  return { products, activeRequests, paymentReady, certificates, recentRequests };
}

export async function getInspectorDashboardData(inspectorId: string) {
  const [missions, done, upcoming] = await Promise.all([
    safeCount("inspection_missions", (q) => q.eq("inspector_id", inspectorId)),
    safeCount("inspection_missions", (q) => q.eq("inspector_id", inspectorId).eq("status", "done")),
    safeRows<{
      id: string;
      mission_number: string | null;
      scheduled_at: string;
      location: string | null;
      status: string;
    }>("inspection_missions", "id,mission_number,scheduled_at,location,status", (q) =>
      q.eq("inspector_id", inspectorId).order("scheduled_at", { ascending: true }).limit(5),
    ),
  ]);

  return { missions, done, upcoming };
}

export async function getLabDashboardData(labAgentId: string) {
  const [assigned, done, tests] = await Promise.all([
    safeCount("lab_tests", (q) => q.eq("lab_agent_id", labAgentId).in("status", ["assigned", "in_progress"])),
    safeCount("lab_tests", (q) => q.eq("lab_agent_id", labAgentId).eq("status", "done")),
    safeRows<{
      id: string;
      test_type: string;
      status: string;
      sample_reference: string | null;
      products: { name: string } | null;
    }>("lab_tests", "id,test_type,status,sample_reference,products(name)", (q) =>
      q.eq("lab_agent_id", labAgentId).order("created_at", { ascending: false }).limit(5),
    ),
  ]);

  return { assigned, done, tests };
}
