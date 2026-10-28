"use client";

import { Search } from "lucide-react";

type SearchBarProps = {
  label: string;
  value: string;
  placeholder?: string;
  onSearch: (value: string) => void;
};

/**
 * Search field with its icon. The parent owns the query and the filtering;
 * this molecule only reports what the user typed.
 */
export function SearchBar({
  label,
  value,
  placeholder,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-sm font-semibold text-text-primary" htmlFor="search">
        {label}
      </label>
      <span className="relative inline-flex w-full">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-text-secondary"
        />
        <input
          id="search"
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onSearch(event.target.value)}
          className="min-h-12 w-full rounded-md border border-border bg-surface pr-3 pl-11 text-base text-text-primary placeholder:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        />
      </span>
    </div>
  );
}
