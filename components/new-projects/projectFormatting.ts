/** List / cards — short PKR line (e.g. `1.2 Cr` without prefix). */
export function formatPriceShort(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)} Lac`;
  return n.toLocaleString();
}

/** Detail page — with `PKR` prefix. */
export function formatPriceFull(n: number) {
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000) return `PKR ${(n / 100000).toFixed(1)} Lac`;
  return `PKR ${n.toLocaleString()}`;
}

export function formatProjectDate(d: string) {
  return new Date(d).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
}
