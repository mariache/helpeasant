"use client";
import { useEffect } from "react";

export function PayAllModal({
  onClose,
  onPickAmount,
}: {
  onClose: () => void;
  onPickAmount: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="big">🤯</div>
        <h2>Legend.</h2>
        <p>
          Card limits say no — email me and we&apos;ll talk. Otherwise, use the free input
          with whatever number suits you.
        </p>
        <div className="modal-actions">
          {email && (
            <a className="btn primary" href={`mailto:${email}?subject=I%20want%20to%20pay%20your%20mortgage`}>
              Email me
            </a>
          )}
          <button className="btn" onClick={onPickAmount}>
            Pick an amount
          </button>
          <button className="btn ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
