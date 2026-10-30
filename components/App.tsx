"use client";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import type { Stats } from "@/lib/types";
import { nextMilestone, unlocked } from "@/lib/milestones";
import { Progress } from "./Progress";
import { PayPanel } from "./PayPanel";
import { DonorWall } from "./DonorWall";
import { BRAND, BRAND_URL, CAMPAIGN_EMOJI, CAMPAIGN_TAGLINE, CAMPAIGN_TITLE, OWNER_CITY, OWNER_NAME } from "@/lib/config";
import { ShareLine } from "@/app/api/ShareLine";

const REFRESH_MS = 15_000;

export function App({ initial }: { initial: Stats }) {
  const [stats, setStats] = useState(initial);
  const [justPaid, setJustPaid] = useState(false);
  const firedRef = useRef(false);

  // Live refresh
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (res.ok) setStats(await res.json());
      } catch {}
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Thank-you + confetti after Stripe redirect, or once per visit if a milestone is unlocked
  useEffect(() => {
    if (firedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const paid = params.get("paid") === "1";
    if (paid) {
      setJustPaid(true);
      window.history.replaceState(null, "", "/");
    }
    if (paid || unlocked(stats.percent).length > 0) {
      firedRef.current = true;
      confetti({ particleCount: paid ? 180 : 90, spread: 80, origin: { y: 0.3 } });
    }
  }, [stats.percent]);

  const next = nextMilestone(stats.percent);
  const done = unlocked(stats.percent);

  return (
    <main className="wrap">
      <header className="header">
        <a className="brand" href={BRAND_URL} target="_blank" rel="noreferrer">
          🧑‍🌾 {BRAND}
        </a>
        <h1>
          {CAMPAIGN_TITLE} {CAMPAIGN_EMOJI}
        </h1>
         <p className="tagline">{CAMPAIGN_TAGLINE}</p>
        <ShareLine />
      </header>

      {justPaid && (
        <div className="thanks" role="status">
          🙏 You absolute legend. Your name hits the wall as soon as Stripe confirms (a few seconds).
        </div>
      )}

      <Progress percent={stats.percent} />

      {next ? (
        <div className="chip">
          🎯 Next: {next.percent}% — {next.emoji} {next.title}
        </div>
      ) : (
        <div className="chip">🎉 Fully paid. This was not supposed to happen.</div>
      )}

      {done.length > 0 && (
        <ul className="badges" aria-label="Unlocked milestones">
          {done.map((m) => (
            <li key={m.percent} title={`${m.percent}%`}>
              {m.emoji} {m.title}
            </li>
          ))}
        </ul>
      )}

      <PayPanel />

      <p className="fine">Donations are gifts and non-refundable. Thank you, weirdo.</p>

      <DonorWall donors={stats.donors} count={stats.donorCount} />

      <footer className="footer">
         <a className="gh-link" href={BRAND_URL} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Build your own with {BRAND} →
        </a>
       <span>
          {OWNER_NAME}, a humble peasant from {OWNER_CITY} 🧑‍🌾
        </span>
      </footer>
    </main>
  );
}
