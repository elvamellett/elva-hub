import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function eur(n: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(n);
}

export function shortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IE", { day: "2-digit", month: "short" });
}

export function timeAgoDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
