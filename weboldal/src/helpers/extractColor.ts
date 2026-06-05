export default function extractColor(from: string) {
  if (from.startsWith("--")) {
    return `var(${from})`;
  } else {
    return from;
  }
}
