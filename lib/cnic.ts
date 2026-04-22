/** Pakistan CNIC: 13 digits */

export function normalizeCnicDigits(input: string): string {
  return String(input || "").replace(/\D/g, "").slice(0, 13);
}

export function isValidCnic13(digits: string): boolean {
  return digits.length === 13;
}

export function formatCnicForStorage(digits: string): string {
  const d = normalizeCnicDigits(digits);
  if (d.length !== 13) return d;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12, 13)}`;
}
