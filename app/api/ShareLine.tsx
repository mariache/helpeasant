"use client";
import { useState } from "react";
import { CAMPAIGN_TITLE } from "@/lib/config";

const SHARE_TEXT = `Help a peasant: ${CAMPAIGN_TITLE} 🏠 Yes, it's a joke. Yes, the button works. @elonmusk`;

export function ShareLine() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: CAMPAIGN_TITLE, text: SHARE_TEXT, url });
        return;
      } catch {
        // user cancelled — fall through to nothing
        return;
      }
    }
    const intent = `https://x.com/intent/post?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button className="share-pill" onClick={share}>
      <span className="share-rocket">🚀</span>
      <span>
        {copied ? "Link copied ✓" : (
          <>Can&apos;t chip in? <strong>Send it to Elon</strong></>
        )}
      </span>
    </button>
  );
}