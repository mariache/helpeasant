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
        <a href={BRAND_URL} target="_blank" rel="noreferrer">
          Build your own with {BRAND} →
        </a>
        <span>
          Made by {OWNER_NAME} in {OWNER_CITY}
        </span>
      </footer>
    </main>
  );
}
