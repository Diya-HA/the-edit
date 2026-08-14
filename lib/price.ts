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
  return cents === 0
    ? `$${Math.round(value)}`
    : `$${value.toFixed(2)}`;
}
