/**
 * Currency formatting. The app is GBP-only for now; if multi-currency is ever
 * needed this is the single place to change.
 *
 * Whole-pound formatting by default (no pence) to match the dashboard's
 * summary figures. Pass `withPence` for line-item amounts once real decimal
 * data lands in Phase 4.
 */

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const gbpWithPence = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatGBP(amount: number, withPence = false): string {
  return (withPence ? gbpWithPence : gbp).format(amount);
}
