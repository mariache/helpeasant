export type Tier = { emoji: string; label: string };

// Amounts are never shown publicly — only the tier.
export function tierFor(amountCents: number): Tier {
  if (amountCents >= 10000) return { emoji: "🏠", label: "Homeowner" };
  if (amountCents >= 5000) return { emoji: "🛋️", label: "Couch money" };
  if (amountCents >= 1000) return { emoji: "🍕", label: "Pizza night" };
  return { emoji: "☕", label: "Coffee" };
}
