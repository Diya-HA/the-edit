/**
 * What counts as a lot for one piece.
 *
 * The rungs live here rather than in the screen that asks, because three
 * places need them now — the welcome asks, settings changes the answer, and
 * the feed note offers the next one up. A ceiling offered in one place but not
 * another is a bug nobody sees until a feed empties.
 *
 * Not in app/actions.ts: that file is "use server", and a server module may
 * only export async functions. A plain constant there compiles but fails at
 * the bundler.
 */

/** Null is the "No ceiling" answer — a real choice, not a missing one. */
export const CEILINGS: (number | null)[] = [150, 300, 500, null];

export function ceilingLabel(value: number | null): string {
  return value === null ? "No ceiling" : `$${value}`;
}

/** The next rung up, which is what "Raise it" offers. */
export function nextCeiling(current: number | null): number | null {
  const at = CEILINGS.indexOf(current);
  if (at === -1) return CEILINGS[0];
  return CEILINGS[Math.min(at + 1, CEILINGS.length - 1)];
}
