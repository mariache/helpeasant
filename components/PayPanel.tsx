"use client";
import { useRef, useState } from "react";
import { MESSAGE_MAX, NAME_MAX } from "@/lib/limits";
import { PayAllModal } from "./PayAllModal";

const PRESETS = [
  { amount: 5, label: "$5", hint: "☕" },
  { amount: 20, label: "$20", hint: "🍕" },
  { amount: 100, label: "$100", hint: "🏠" },
];

export function PayPanel() {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<null | number | "custom">(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  async function pay(dollars: number, which: number | "custom") {
    setError(null);
    if (!Number.isFinite(dollars) || dollars < 1) {
      setError("Minimum is $1. Generosity has a floor.");
      return;
    }
    setLoading(which);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents: Math.round(dollars * 100), name, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(null);
    }
  }

  return (
    <section className="pay">
      <div className="fields">
        <input
          placeholder="Your name (optional)"
          maxLength={NAME_MAX}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Message for the wall (optional)"
          maxLength={MESSAGE_MAX}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="presets">
        {PRESETS.map((p) => (
          <button
            key={p.amount}
            className="btn preset"
            disabled={loading !== null}
            onClick={() => pay(p.amount, p.amount)}
          >
            <span className="preset-hint">{p.hint}</span>
            {loading === p.amount ? "…" : p.label}
          </button>
        ))}
      </div>

      <form
        className="custom"
        onSubmit={(e) => {
          e.preventDefault();
          pay(Number(amount), "custom");
        }}
      >
        <span className="dollar">$</span>
        <input
          ref={amountRef}
          type="number"
          inputMode="decimal"
          min={1}
          step="0.01"
          placeholder="Any amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-label="Custom amount in dollars"
        />
        <button className="btn" type="submit" disabled={loading !== null}>
          {loading === "custom" ? "…" : "Pay"}
        </button>
      </form>

      <button className="btn ghost" onClick={() => setShowModal(true)}>
        Pay it all off 🤯
      </button>

      {error && <p className="error">{error}</p>}

      {showModal && (
        <PayAllModal
          onClose={() => setShowModal(false)}
          onPickAmount={() => {
            setShowModal(false);
            setTimeout(() => amountRef.current?.focus(), 50);
          }}
        />
      )}
    </section>
  );
}