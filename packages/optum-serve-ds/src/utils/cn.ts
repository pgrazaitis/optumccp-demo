// Lightweight className merger — no external deps required
// Use with tailwind or plain CSS modules
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
