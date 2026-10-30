import filter from "leo-profanity";

import { MESSAGE_MAX, NAME_MAX } from "./limits";
export { MESSAGE_MAX, NAME_MAX };

function clean(input: unknown, max: number): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.replace(/\s+/g, " ").trim().slice(0, max);
  if (!trimmed) return null;
  return filter.clean(trimmed);
}

export const cleanName = (v: unknown) => clean(v, NAME_MAX);
export const cleanMessage = (v: unknown) => clean(v, MESSAGE_MAX);
