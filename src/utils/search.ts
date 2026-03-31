export const FT_MIN_TOKEN_SIZE = 3;

export const SEARCH_MAX_RAW_LENGTH = 100;
export const SEARCH_MAX_TOKEN_COUNT = 10;
export const SEARCH_DEBOUNCE_MS = 300;

export function tokenize(raw: string): string[] {
  return raw
    .trim()
    .split(/[^\p{L}\p{N}_]+/u)
    .filter(Boolean)
    .filter((t) => t.length >= FT_MIN_TOKEN_SIZE)
    .slice(0, SEARCH_MAX_TOKEN_COUNT);
}

export function hasSearchableTokens(raw: string): boolean {
  return tokenize(raw).length > 0;
}

export function toMySQLFullTextQuery(raw: string): string {
  const tokens = tokenize(raw);
  if (tokens.length === 0) return "";
  return tokens.map((t) => `+${t}*`).join(" ");
}

export type SearchValidationError =
  | "EMPTY"
  | "TOO_LONG"
  | "NO_SEARCHABLE_TOKENS";

export function validateSearchQuery(raw: string): SearchValidationError | null {
  if (!raw.trim()) return "EMPTY";
  if (raw.length > SEARCH_MAX_RAW_LENGTH) return "TOO_LONG";
  if (!hasSearchableTokens(raw)) return null;
  return null;
}
