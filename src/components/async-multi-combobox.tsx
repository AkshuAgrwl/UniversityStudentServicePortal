"use client";

import React from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import { useAsyncSearch } from "@/hooks/use-async-search";

export interface AsyncMultiComboboxProps<T> {
  value: T[];
  onChange: (value: T[]) => void;
  itemKey: (item: T) => string;
  itemToString: (item: T) => string;
  fetchItems: (query: string, signal: AbortSignal) => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
  renderChipLabel?: (item: T) => React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
}

export function AsyncMultiCombobox<T>({
  value,
  onChange,
  itemKey,
  itemToString,
  fetchItems,
  renderItem,
  renderChipLabel,
  placeholder = "Search...",
  disabled,
}: AsyncMultiComboboxProps<T>) {
  const {
    searchValue,
    isPending,
    searchError,
    isQueryReady,
    comboboxItems,
    handleInputValueChange,
    handleValueChange,
    handleOpenChangeComplete,
  } = useAsyncSearch(value, { itemKey, fetchItems });

  const emptyMessage = (() => {
    if (isPending) return "Searching…";
    if (searchError) return searchError;
    if (!searchValue.trim()) return "Start typing to search.";
    if (!isQueryReady) return "Keep typing…";
    return `No results for "${searchValue}".`;
  })();

  return (
    <Combobox
      items={comboboxItems}
      itemToStringValue={itemToString}
      multiple
      filter={null}
      value={value}
      onValueChange={(next) => handleValueChange(next, onChange)}
      onInputValueChange={handleInputValueChange}
      onOpenChangeComplete={handleOpenChangeComplete}
      disabled={disabled}
    >
      <ComboboxChips>
        <ComboboxValue>
          {(selected: T[]) =>
            selected.map((item) => (
              <ComboboxChip key={itemKey(item)}>
                {renderChipLabel ? renderChipLabel(item) : itemToString(item)}
              </ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput
          placeholder={value.length === 0 ? placeholder : ""}
        />
      </ComboboxChips>

      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item: T) => (
            <ComboboxItem key={itemKey(item)} value={item}>
              {renderItem(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
