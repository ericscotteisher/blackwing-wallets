"use client";

import Image from "next/image";

import type { Timeframe, WalletView } from "../constants";
import { timeframes } from "../constants";
import { getWalletDisplayName } from "../utils";
import type { BottomTabId } from "./BottomTabs";

type WalletHeaderProps = {
  activeTab: BottomTabId;
  selectedWallet: WalletView | null;
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  isWatchingSelectedWallet?: boolean;
  onToggleSelectedWalletWatch?: () => void;
  onShareSelectedWallet?: () => void;
  onRenameSelectedWallet?: () => void;
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

const navTitleClass = "text-[22px] font-semibold tracking-[0.02em] text-white";

export function WalletHeader({
  activeTab,
  selectedWallet,
  selectedTimeframe,
  onTimeframeChange,
  isWatchingSelectedWallet,
  onToggleSelectedWalletWatch,
  onShareSelectedWallet,
  onRenameSelectedWallet,
  onBack,
}: WalletHeaderProps) {
  const selectedWalletLabel = selectedWallet ? getWalletDisplayName(selectedWallet) : "";
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
            className="flex h-10 items-center justify-center text-white transition hover:text-white/80"
            aria-label="Back to wallets"
          >
            <ChevronLeftIcon />
          </button>
          <p className="text-[16px] font-medium tracking-[0.02em] text-[#848484]">
            <span>@</span>{" "}
            <span className="text-white">{selectedWalletLabel}</span>
            <span>’s wallet</span>
          </p>
        </div>
      );
    }
    return renderTabHeading("Wallets");
  };

  const renderRightContent = () => {
    if (activeTab !== "Wallets") {
      return <div className="h-8 w-8" />;
    }

    if (selectedWallet) {
      return (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Rename wallet"
            onClick={onRenameSelectedWallet}
            className="flex h-10 w-10 items-center justify-center text-white transition hover:text-white/80"
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            aria-label={isWatchingSelectedWallet ? "Unfollow wallet" : "Follow wallet"}
            onClick={onToggleSelectedWalletWatch}
            className="flex h-10 w-10 items-center justify-center text-white transition hover:text-white/80"
          >
            <Image
              src={
                isWatchingSelectedWallet
                  ? "/icons/watching-active.png"
                  : "/icons/watching-off.png"
              }
              alt={isWatchingSelectedWallet ? "Watching" : "Not watching"}
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </button>
          <button
            type="button"
            aria-label="Share wallet"
            onClick={onShareSelectedWallet}
            className="flex h-10 w-10 items-center justify-center text-white transition hover:text-white/80"
          >
            <ShareIcon className="h-6 w-6" />
          </button>
        </div>
      );
    }

    return (
      <TimeframeSelector
        current={selectedTimeframe}
        onSelect={onTimeframeChange}
      />
    );
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-[#0C0C0C] px-5">
      {renderContent()}
      {renderRightContent()}
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

type TimeframeSelectorProps = {
  current: Timeframe;
  onSelect: (timeframe: Timeframe) => void;
};

function TimeframeSelector({ current, onSelect }: TimeframeSelectorProps) {
  return (
    <div className="inline-flex items-center gap-0 rounded-[10px] bg-transparent">
      {timeframes.map((timeframe) => {
        const isActive = timeframe === current;
        return (
          <button
            key={timeframe}
            type="button"
            onClick={() => onSelect(timeframe)}
            aria-pressed={isActive}
            className={`px-2 py-[3px] text-[14px] font-medium tracking-[0.02em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 ${
              isActive
                ? "rounded-[8px] bg-[#32353D] text-white"
                : "rounded-[8px] bg-transparent text-[#AFAFAF] hover:text-white"
            }`}
          >
            {timeframe}
          </button>
        );
      })}
    </div>
  );
}

function ShareIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} text-white`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v14" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}
