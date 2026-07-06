export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
