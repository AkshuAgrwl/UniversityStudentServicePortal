// hooks/use-async-search.ts
import React from "react";
import {
  hasSearchableTokens,
  validateSearchQuery,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MAX_RAW_LENGTH,
} from "@/utils/search";

interface UseAsyncSearchOptions<T> {
  itemKey: (item: T) => string;
  fetchItems: (query: string, signal: AbortSignal) => Promise<T[]>;
}

export interface UseAsyncSearchReturn<T> {
  searchValue: string;
  isPending: boolean;
  searchError: string | null;
  isQueryReady: boolean;
  comboboxItems: T[];
  handleInputValueChange: (next: string, meta: { reason: string }) => void;
  handleValueChange: (next: T[], rhfOnChange: (v: T[]) => void) => void;
  handleOpenChangeComplete: (open: boolean) => void;
}

export function useAsyncSearch<T>(
  selectedItems: T[],
  { itemKey, fetchItems }: UseAsyncSearchOptions<T>,
): UseAsyncSearchReturn<T> {
  const [searchResults, setSearchResults] = React.useState<T[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const [searchError, setSearchError] = React.useState<string | null>(null);

  const selectedRef = React.useRef<T[]>(selectedItems);
  const abortRef = React.useRef<AbortController | null>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    selectedRef.current = selectedItems;
  }, [selectedItems]);

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const isQueryReady = hasSearchableTokens(searchValue);

  const comboboxItems = React.useMemo<T[]>(() => {
    const normalizedResults = searchResults.map((result) => {
      const alreadySelected = selectedItems.find(
        (s) => itemKey(s) === itemKey(result),
      );
      return alreadySelected ?? result;
    });
    const extras = selectedItems.filter(
      (s) => !searchResults.some((r) => itemKey(r) === itemKey(s)),
    );
    return [...normalizedResults, ...extras];
  }, [searchResults, selectedItems, itemKey]);

  function handleInputValueChange(
    next: string,
    { reason }: { reason: string },
  ) {
    // Hard-cap the input length — silently truncate so the field doesn't
    // feel broken, while still preventing oversized strings reaching the API.
    const capped = next.slice(0, SEARCH_MAX_RAW_LENGTH);
    setSearchValue(capped);

    if (reason === "item-press") return;

    // Always cancel the previous debounce timer and in-flight request
    // when the input changes, even if we decide not to fetch below.
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    abortRef.current?.abort();

    if (!capped.trim()) {
      setSearchResults(selectedRef.current);
      setSearchError(null);
      return;
    }

    const validationError = validateSearchQuery(capped);
    if (validationError === "TOO_LONG") {
      // Shouldn't reach here due to the cap above, but guard anyway.
      setSearchError("Search query is too long.");
      return;
    }

    if (!hasSearchableTokens(capped)) {
      // Input has content but no token is long enough yet — show "keep
      // typing" state. No fetch, no error.
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    // Debounce: wait for the user to stop typing before fetching.
    // This is the primary API abuse prevention on the frontend —
    // rapid keystrokes produce one request, not one per character.
    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      startTransition(async () => {
        setSearchError(null);
        try {
          const results = await fetchItems(capped.trim(), controller.signal);
          if (controller.signal.aborted) return;
          startTransition(() => setSearchResults(results));
        } catch {
          if (controller.signal.aborted) return;
          setSearchError("Failed to load results. Please try again.");
        }
      });
    }, SEARCH_DEBOUNCE_MS);
  }

  function handleValueChange(next: T[], rhfOnChange: (v: T[]) => void) {
    selectedRef.current = next;
    rhfOnChange(next);
    setSearchValue("");
    setSearchError(null);
    setSearchResults(next);
  }

  function handleOpenChangeComplete(open: boolean) {
    if (!open) {
      // Cancel any pending debounced fetch when the dropdown closes.
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      abortRef.current?.abort();
      setSearchResults(selectedRef.current);
    }
  }

  return {
    searchValue,
    isPending,
    searchError,
    isQueryReady,
    comboboxItems,
    handleInputValueChange,
    handleValueChange,
    handleOpenChangeComplete,
  };
}
