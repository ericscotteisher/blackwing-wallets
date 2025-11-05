"use client";

import { useMemo, useState } from "react";

import {
  baseTextClass,
  discoverStatuses,
  walletFilterTabs,
  type DiscoverSort,
  type Section,
  type WalletFilter,
  type Timeframe,
  type WalletView,
} from "../constants";
import { AnimatedList } from "./AnimatedList";
import { SectionActions } from "./SectionActions";
import { WalletRow } from "./WalletRow";

type WalletFeedProps = {
  wallets: WalletView[];
  walletFilter: WalletFilter;
  expandedWallets: Record<string, boolean>;
  timeframe: Timeframe;
  onToggleWallet: (walletId: string) => void;
  onWalletSelect: (wallet: WalletView) => void;
  onWalletFilterChange: (filter: WalletFilter) => void;
  discoverSort: DiscoverSort;
  onDiscoverEllipsis: () => void;
  onWatchingPlus: () => void;
};

export function WalletFeed({
  wallets,
  walletFilter,
  expandedWallets,
  timeframe,
  onToggleWallet,
  onWalletSelect,
  onWalletFilterChange,
  discoverSort,
  onDiscoverEllipsis,
  onWatchingPlus,
}: WalletFeedProps) {
  const [sectionExpansion, setSectionExpansion] = useState<Record<string, boolean>>(
    {},
  );

  const filteredWallets = useMemo(() => {
    if (walletFilter === "All") return wallets;
    if (walletFilter === "Watching") {
      return wallets.filter((wallet) => wallet.status === "Watching");
    }
    if (walletFilter === "KOLs") {
      return wallets.filter((wallet) => wallet.status === "KOL");
    }
    if (walletFilter === "Whales") {
      return wallets.filter((wallet) => wallet.status === "Whale");
    }
    if (walletFilter === "Alpha") {
      return wallets.filter((wallet) => wallet.status === "Alpha");
    }
    return wallets;
  }, [wallets, walletFilter]);

  const sections = useMemo<Section[]>(() => {
    const result: Section[] = [];

    const watching = filteredWallets.filter(
      (wallet) => wallet.status === "Watching",
    );
    if (watching.length > 0) {
      result.push({ id: "watching", name: "Watching", wallets: watching });
    }

    const discover = filteredWallets.filter((wallet) =>
      discoverStatuses.includes(wallet.status),
    );
    if (discover.length > 0) {
      const sorted = [...discover].sort((a, b) => {
        if (discoverSort === "recent") {
          return (
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          );
        }
        return (
          b.pnl[timeframe].money - a.pnl[timeframe].money
        );
      });
      result.push({ id: "discover", name: "Discover", wallets: sorted });
    }

    return result;
  }, [filteredWallets, discoverSort, timeframe]);

  const handleSectionToggle = (sectionId: string) => {
    setSectionExpansion((prev) => {
      const current = prev[sectionId] ?? true;
      return {
        ...prev,
        [sectionId]: !current,
      };
    });
  };

  return (
    <div className={`${baseTextClass} pb-8 text-white`}>
      <div className="-mx-6 mt-6 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
        <div className="flex w-max gap-1.5 px-6 [&::-webkit-scrollbar]:hidden">
          {walletFilterTabs.map((tab) => {
            const isActive = tab === walletFilter;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onWalletFilterChange(tab)}
                className={`h-9 rounded-[10px] border px-4 font-semibold tracking-[0.02em] transition ${
                  isActive
                    ? "border-transparent bg-white text-black"
                    : "border-[#181818] bg-transparent text-white hover:bg-[#181818]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        {sections.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10 text-[#A1A1A1]">
            No wallets in this view yet.
          </div>
        ) : (
          sections.map((section, index) => {
            const isExpanded = sectionExpansion[section.id] ?? true;
            const isLast = index === sections.length - 1;
            const spacingClass = isLast ? "" : "mb-6";
            return (
              <section key={section.id} className={spacingClass}>
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleSectionToggle(section.id)}
                    className="flex items-center gap-3"
                    aria-expanded={isExpanded}
                  >
                    <span className="text-[14px] font-medium tracking-[0.02em] text-[#848484]">
                      {section.name}
                    </span>
                    <SectionCaret open={isExpanded} />
                  </button>
                  <SectionActions
                    sectionId={section.id}
                    onEllipsis={section.id === "discover" ? onDiscoverEllipsis : undefined}
                    onPlus={section.id === "watching" ? onWatchingPlus : undefined}
                  />
                </div>

                <AnimatedList
                  items={section.wallets}
                  expanded={isExpanded}
                  className="space-y-0"
                  renderItem={(wallet) => (
                    <WalletRow
                      sectionId={section.id}
                      wallet={wallet}
                      expanded={Boolean(expandedWallets[wallet.id])}
                      timeframe={timeframe}
                      onToggle={() => onToggleWallet(wallet.id)}
                      onSelect={() => onWalletSelect(wallet)}
                    />
                  )}
                  getKey={(wallet) => wallet.id}
                />
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

function SectionCaret({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 text-[#464B55] transition-transform duration-200 ${
        open ? "" : "-rotate-90"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
