"use client";

import Image from "next/image";

import type { Timeframe, WalletView } from "../constants";
import { baseTextClass, timeframes } from "../constants";
import type { BottomTabId } from "./BottomTabs";

type WalletHeaderProps = {
  activeTab: BottomTabId;
  selectedWallet: WalletView | null;
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
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

export function WalletHeader({
  activeTab,
  selectedWallet,
  selectedTimeframe,
  onTimeframeChange,
  onBack,
}: WalletHeaderProps) {
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

  const renderRightContent = () => {
    if (activeTab !== "Wallets") {
      return <div className="h-8 w-8" />;
    }

    return (
      <TimeframeSelector
        current={selectedTimeframe}
        onSelect={onTimeframeChange}
      />
    );
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#0C0C0C] px-6">
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
