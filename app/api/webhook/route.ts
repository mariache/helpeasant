import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { cleanMessage, cleanName } from "@/lib/sanitize";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Bad signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    // Counter only moves on confirmed money.
    if (session.payment_status !== "paid" || !session.amount_total) {
      return NextResponse.json({ received: true });
    }

    const { error } = await getSupabase().from("donations").upsert(
      {
        stripe_session_id: session.id,
        amount_cents: session.amount_total,
        name: cleanName(session.metadata?.name),
        message: cleanMessage(session.metadata?.message),
      },
      { onConflict: "stripe_session_id", ignoreDuplicates: true } // idempotent on retries
    );

    if (error) {
      console.error("Supabase insert failed", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 }); // Stripe will retry
    }
  }

  return NextResponse.json({ received: true });
}
