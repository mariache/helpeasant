import { getStats } from "@/lib/stats";
import type { Stats } from "@/lib/types";
import { App } from "@/components/App";

export const dynamic = "force-dynamic";

export default async function Page() {
  let initial: Stats = { percent: 0, donorCount: 0, donors: [] };
  try {
    initial = await getStats();
  } catch (err) {
    console.error("Initial stats failed", err);
  }
  return <App initial={initial} />;
}
