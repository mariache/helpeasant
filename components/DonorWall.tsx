import type { PublicDonor } from "@/lib/types";

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function DonorWall({ donors, count }: { donors: PublicDonor[]; count: number }) {
  return (
    <section className="wall">
      <h2>
        Wall of weirdos <span className="count">{count}</span>
      </h2>
      <p className="legend">☕ under $10 · 🍕 $10–49 · 🛋️ $50–99 · 🏠 $100+</p>
      {donors.length === 0 ? (
        <p className="empty">Nobody yet. Be the first legend.</p>
      ) : (
        <ul>
          {donors.map((d) => (
            <li key={d.id}>
              <span className="tier" title={d.tierLabel}>{d.emoji}</span>
              <div>
                <div className="who">
                  {d.name} <time>{timeAgo(d.createdAt)}</time>
                </div>
                {d.message && <div className="msg">“{d.message}”</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
