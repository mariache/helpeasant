import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { cleanMessage, cleanName } from "@/lib/sanitize";
import { BRAND, CAMPAIGN_EMOJI, CAMPAIGN_TITLE } from "@/lib/config";

export const runtime = "nodejs";

const MIN_CENTS = 100; // $1
const MAX_CENTS = 1_000_000; // $10,000 — card limits make more unrealistic anyway

export async function POST(req: Request) {
  let body: { amountCents?: unknown; name?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amountCents = Math.round(Number(body.amountCents));
  if (!Number.isFinite(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) {
    return NextResponse.json(
      { error: `Amount must be between $${MIN_CENTS / 100} and $${MAX_CENTS / 100}` },
      { status: 400 }
    );
  }

  const name = cleanName(body.name) ?? "";
  const message = cleanMessage(body.message) ?? "";
  const site = process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    submit_type: "donate",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: `${CAMPAIGN_TITLE} ${CAMPAIGN_EMOJI}`,
            description: `A gift via ${BRAND}. Thank you, future billionaire.`,
          },
        },
      },
    ],
    custom_text: {
      submit: { message: "Donations are gifts and non-refundable." },
    },
    metadata: { name, message },
    success_url: `${site}/?paid=1`,
    cancel_url: `${site}/`,
  });

  return NextResponse.json({ url: session.url });
}
