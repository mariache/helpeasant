# Helpeasant 🧑‍🌾

> Strangers chip in on your debt. Yes, it's a joke. Yes, the button works.

Open-source, one-page PWA for running your own joke-but-real payoff campaign — e.g. **Pay My Mortgage** at [helpeasant.com](https://helpeasant.com).
Rename the campaign with `NEXT_PUBLIC_CAMPAIGN_*` env vars — no code changes.

It shows **% paid only**, never your balance or dollar totals.

**Stack:** Next.js 15 (App Router) · Stripe Checkout + webhook · Supabase (Postgres) · Vercel

## Features
- Pay $100 / any amount / "Pay it all off" (joke modal → email or free input)
- Live % counter (4 decimals) that refreshes every 15s and moves **only** on Stripe-confirmed payments
- Fun % milestones with confetti
- Donor wall with tier emojis instead of amounts (☕ 🍕 🛋️ 🏠) and profanity-filtered messages
- Installable PWA, dark mode

## Build your own (≈15 min)

1. **Clone & install**
   ```bash
   git clone https://github.com/helpeasant/helpeasant && cd helpeasant
   npm install
   cp .env.example .env.local
   ```
2. **Supabase:** create a project, run `supabase/schema.sql` in the SQL editor, then copy the URL and the **service role** key into `.env.local`.
3. **Stripe:** copy your secret key. For local webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   Paste the printed `whsec_...` as `STRIPE_WEBHOOK_SECRET`.
4. **Your balance:** set `MORTGAGE_BALANCE_CENTS` (server-only; e.g. `$300,000` → `30000000`). Rounding it is fine.
5. **Run:** `npm run dev`, then pay with test card `4242 4242 4242 4242`.
6. **Deploy:** push to Vercel and add the same env vars. Then in Stripe → Developers → Webhooks, add
   `https://your-domain/api/webhook` with the events `checkout.session.completed` and `checkout.session.async_payment_succeeded`.

## Notes
- Check Stripe's restricted-business list for personal fundraising before going live.
- Privacy: the % is rounded, but someone who donates and watches the % change can roughly estimate the balance. Round `MORTGAGE_BALANCE_CENTS` if that bothers you.
- Donations are gifts and non-refundable. Keep your own records for taxes.

## License
MIT
