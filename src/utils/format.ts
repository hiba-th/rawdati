// Money as "15 000 DA" (space thousands separator, as the design asks).
export function formatDA(amount: number, currency = 'DA') {
  const digits = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${digits} ${currency}`;
}

// "555123456" -> "555 12 34 56"
export function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 9);
  const parts = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.join(' ');
}

export function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

export function nowHHMM(date = new Date()) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}
