"use client";

import type { WalletView } from "../constants";
import { baseTextClass } from "../constants";
import type { BottomTabId } from "./BottomTabs";

type WalletHeaderProps = {
  activeTab: BottomTabId;
  selectedWallet: WalletView | null;
  onBack: () => void;
};

export function WalletHeader({ activeTab, selectedWallet, onBack }: WalletHeaderProps) {
  const renderContent = () => {
    if (activeTab !== "Wallets") {
      return (
        <div className="flex flex-1 justify-center">
          <span className={`${baseTextClass} text-white`}>{activeTab}</span>
        </div>
      );
    }

    if (selectedWallet) {
      return (
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10"
            aria-label="Back to wallets"
          >
            <ChevronLeftIcon />
          </button>
          <span className={`${baseTextClass} text-white`}>
            {selectedWallet.name}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white">
          <WalletGlyph />
        </div>
        <span className="text-[24px] font-semibold tracking-[0.02em] text-white">
          Wallets
        </span>
      </div>
    );
  };

  return (
    <header className="flex h-16 items-center justify-between px-6">
      {renderContent()}
      {activeTab === "Wallets" && !selectedWallet ? (
        <button
          type="button"
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 ${baseTextClass}`}
          aria-label="Wallet info"
        >
          i
        </button>
      ) : (
        <div className="h-8 w-8" />
      )}
    </header>
  );
}

function ChevronLeftIcon() {
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
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function WalletGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v9a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 16.5z" />
      <path d="M17 11h-4a2 2 0 1 0 0 4h4z" className="text-violet-200" />
    </svg>
  );
}
