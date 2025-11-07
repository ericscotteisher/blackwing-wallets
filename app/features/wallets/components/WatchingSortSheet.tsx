"use client";

import type { WatchingSort } from "../constants";

const watchingSortOptions: Array<{ value: WatchingSort; label: string }> = [
  { value: "top", label: "Top performer" },
  { value: "recent", label: "Recently added" },
  { value: "auto", label: "Auto trade first" },
];

type WatchingSortSheetProps = {
  open: boolean;
  selected: WatchingSort;
  onSelect: (value: WatchingSort) => void;
  onClose: () => void;
};

export function WatchingSortSheet({
  open,
  selected,
  onSelect,
  onClose,
}: WatchingSortSheetProps) {
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
          {watchingSortOptions.map((option, index) => {
            const isSelected = option.value === selected;
            const isLast = index === watchingSortOptions.length - 1;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className={`flex w-full items-center justify-between px-6 py-4 text-left text-[16px] font-medium tracking-[0.02em] text-white ${
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
          className="block w-full rounded-2xl border border-white/10 bg-[#141417] px-6 py-4 text-center text-[16px] font-medium tracking-[0.02em] text-white"
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
