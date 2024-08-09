/**
 * Array Utility Functions.
 */

// Generates sub-arrays of length `chunkSize` from `arr`.
export function* chunks<T>(arr: T[], chunkSize: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}
