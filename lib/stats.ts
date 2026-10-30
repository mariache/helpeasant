import { getSupabase } from "./supabase";
import { tierFor } from "./tiers";
import type { Stats } from "./types";

export async function getStats(): Promise<Stats> {
  const balance = Number(process.env.MORTGAGE_BALANCE_CENTS);
  if (!balance || balance <= 0) throw new Error("MORTGAGE_BALANCE_CENTS not set");

  const supabase = getSupabase();
  const [{ data: total, error: totalErr }, { data: rows, error: rowsErr, count }] =
    await Promise.all([
      supabase.from("donation_total").select("total_cents").single(),
      supabase
        .from("donations")
        .select("id, amount_cents, name, message, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  if (totalErr) throw totalErr;
  if (rowsErr) throw rowsErr;

  const raw = (Number(total?.total_cents ?? 0) / balance) * 100;
  // Rounded to 4 decimals — never send cents or the balance to the client.
  const percent = Math.min(100, Math.round(raw * 10000) / 10000);

  return {
    percent,
    donorCount: count ?? 0,
    donors: (rows ?? []).map((r) => {
      const t = tierFor(r.amount_cents);
      return {
        id: r.id,
        name: r.name || "Anonymous",
        message: r.message,
        emoji: t.emoji,
        tierLabel: t.label,
        createdAt: r.created_at,
      };
    }),
  };
}
