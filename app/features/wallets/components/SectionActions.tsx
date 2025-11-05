"use client";

import type { WalletSectionId } from "../constants";

type SectionActionsProps = {
  sectionId: WalletSectionId;
  onEllipsis?: () => void;
  onPlus?: () => void;
};

export function SectionActions({ sectionId, onEllipsis, onPlus }: SectionActionsProps) {
  if (sectionId === "auto-trade") {
    return (
      <div className="flex items-center gap-3 text-[15px] text-[#848484]">
        <EllipsisButton onClick={onEllipsis} />
        <InfoIcon />
      </div>
    );
  }

  if (sectionId === "watching") {
    return (
      <div className="flex items-center gap-3 text-[15px] text-[#848484]">
        <EllipsisButton onClick={onEllipsis} />
        <PlusButton onClick={onPlus} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-[15px] text-[#848484]">
      <EllipsisButton onClick={onEllipsis} />
    </div>
  );
}

function EllipsisButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center text-inherit ${onClick ? "" : "cursor-default"}`}
    >
      <EllipsisIcon />
    </button>
  );
}

function PlusButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center text-inherit"
    >
      <PlusIcon />
    </button>
  );
}

function EllipsisIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[16px] w-[20px]" fill="currentColor">
      <circle cx="3" cy="12" r="3" />
      <circle cx="13" cy="12" r="3" />
      <circle cx="23" cy="12" r="3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[20px] w-[20px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/4 text-[14px] font-bold text-white">
      i
    </div>
  );
}
