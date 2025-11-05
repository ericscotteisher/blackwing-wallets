"use client";

import Image from "next/image";

import type { WalletView } from "../constants";
import { baseTextClass } from "../constants";
import type { BottomTabId } from "./BottomTabs";

type WalletHeaderProps = {
  activeTab: BottomTabId;
  selectedWallet: WalletView | null;
  onBack: () => void;
};

const tabIcons: Record<BottomTabId, { src: string; alt: string }> = {
  Wallets: {
    src: "/top-icons/wallet-top-icon.png",
    alt: "Wallets icon",
  },
  Discover: {
    src: "/top-icons/daddy-top-icon.png",
    alt: "Discover icon",
  },
  Sugar: {
    src: "/top-icons/sugar-top-icon.png",
    alt: "Sugar icon",
  },
};

const navTitleClass = "text-[24px] font-semibold tracking-[0.02em] text-white";

export function WalletHeader({ activeTab, selectedWallet, onBack }: WalletHeaderProps) {
  const renderTabHeading = (tab: BottomTabId) => {
    const icon = tabIcons[tab];
    return (
      <div className="flex flex-1 items-center gap-3">
        <Image
          src={icon.src}
          alt={icon.alt}
          width={32}
          height={32}
          priority={tab === activeTab}
        />
        <span className={navTitleClass}>{tab}</span>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab !== "Wallets") {
      return renderTabHeading(activeTab);
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

    return renderTabHeading("Wallets");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#0C0C0C] px-6">
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
