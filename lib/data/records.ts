import { createClient } from "@/lib/supabase/server";

export async function readRecords<T>(
  table: string,
  select: string,
  configure?: (query: QueryLike) => QueryLike,
): Promise<T[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from(table).select(select) as unknown as QueryLike;
    if (configure) query = configure(query);
    const { data } = await query;
    return (data ?? []) as T[];
  } catch {
    return [];
  }
}

type QueryLike = PromiseLike<{ data?: unknown }> & {
  eq(column: string, value: unknown): QueryLike;
  in(column: string, values: readonly unknown[]): QueryLike;
  order(column: string, options?: { ascending?: boolean }): QueryLike;
  limit(count: number): QueryLike;
};
