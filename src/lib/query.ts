export type Query = Record<string, string | string[] | undefined>;

export function first(value: Query[string]) {
  return Array.isArray(value) ? value[0] : value;
}
