export function intFromString(s: string) {
  const n = parseInt(s, 10);
  if (isNaN(n)) {
    throw new Error('Invalid number');
  }
  return n;
}
