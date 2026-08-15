/**
 * One way to write a price, everywhere.
 *
 * Real catalogues price at $32.50 as readily as $328, and template
 * interpolation renders the first as "$32.5", which reads as a bug because it
 * is one. Cents appear only when there are cents, so a feed of round prices
 * stays clean and a half-dollar one stays correct.
 */
export function formatPrice(value: number): string {
  const cents = Math.round(value * 100) % 100;
  /* Grouped, because four figures without a separator reads as a part number.
     Dôen's ceiling is near $3,000, so this is not hypothetical. */
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents === 0 ? 0 : 2,
    maximumFractionDigits: cents === 0 ? 0 : 2,
  });
}

/* Sanity, since this is the kind of function that is wrong in one case only:
     0        -> $0
     18       -> $18
     32.5     -> $32.50
     1240     -> $1,240
     2998.5   -> $2,998.50
*/
