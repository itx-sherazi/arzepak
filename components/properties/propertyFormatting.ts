/** List cards — compact (PKR added in JSX). */
export function formatPriceCompact(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)} Lac`;
  return n.toLocaleString();
}

/** Detail hero — e.g. `12.50 Crore` / `15.0 Lac` (no `PKR` prefix; template adds it). */
export function formatPriceDetail(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)} Lac`;
  return n.toLocaleString();
}

export function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 864e5);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(d).toLocaleDateString();
}
