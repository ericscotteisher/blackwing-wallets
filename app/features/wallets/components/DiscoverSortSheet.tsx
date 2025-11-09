"use client";

import type { DiscoverSort } from "../constants";

const discoverSortOptions: Array<{ value: DiscoverSort; label: string }> = [
  { value: "recent", label: "Recently added" },
  { value: "top", label: "Top performer" },
];

type DiscoverSortSheetProps = {
  open: boolean;
  selected: DiscoverSort;
  onSelect: (value: DiscoverSort) => void;
  onClose: () => void;
};

export function DiscoverSortSheet({
  open,
  selected,
  onSelect,
  onClose,
}: DiscoverSortSheetProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end transition ${
        open ? "pointer-events-auto bg-black/40" : "pointer-events-none bg-transparent"
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full"
        aria-label="Close sort options"
      />
      <div
        className={`relative mx-4 mb-6 translate-y-6 space-y-3 rounded-3xl bg-[#1B1B1D] p-5 transition-transform duration-200 ease-out ${
          open ? "translate-y-0" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141417]">
          {discoverSortOptions.map((option, index) => {
            const isSelected = option.value === selected;
            const isLast = index === discoverSortOptions.length - 1;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className={`flex w-full items-center justify-between px-5 py-4 text-left text-[16px] font-medium tracking-[0.02em] text-white ${
                  isLast ? "" : "border-b border-white/10"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <CheckIcon />}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="block w-full rounded-2xl border border-white/10 bg-[#141417] px-5 py-4 text-center text-[16px] font-medium tracking-[0.02em] text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}
