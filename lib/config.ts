// Brand = the open-source project. Campaign = what this deployment is raising for.
export const BRAND = "Helpeasant";
export const BRAND_URL = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/mariache/helpeasant";

export const CAMPAIGN_TITLE = process.env.NEXT_PUBLIC_CAMPAIGN_TITLE ?? "Pay My Mortgage";
export const CAMPAIGN_EMOJI = process.env.NEXT_PUBLIC_CAMPAIGN_EMOJI ?? "🏠";
export const CAMPAIGN_TAGLINE =
  process.env.NEXT_PUBLIC_CAMPAIGN_TAGLINE ?? "Yes, it's a joke. Yes, the button works.";
export const OWNER_NAME = process.env.NEXT_PUBLIC_OWNER_NAME ?? "a peasant";
export const OWNER_CITY = process.env.NEXT_PUBLIC_OWNER_CITY ?? "Houston";
