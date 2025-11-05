"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  tokenRecords,
  walletRecords,
  TokenRecord,
  WalletRecord,
  WalletStatus,
} from "./data";

const walletFilterTabs = ["All", "Watching", "KOLs", "Whales", "Alpha"] as const;
type WalletFilter = (typeof walletFilterTabs)[number];
type DiscoverSort = "recent" | "top";

type WalletView = WalletRecord & {
  trades: TokenRecord[];
};

type Section = {
  id: string;
  name: string;
  wallets: WalletView[];
};

type TradeSummaryInfo = {
  tradesLabel: string;
  winRateLabel: string;
};

type TradeListEntry =
  | { kind: "summary"; id: string; summary: TradeSummaryInfo }
  | { kind: "trade"; id: string; trade: TokenRecord };

const discoverStatuses: WalletStatus[] = ["KOL", "Whale", "Alpha"];

const badgePalette = [
  "bg-amber-500/20 text-amber-200",
  "bg-violet-500/20 text-violet-200",
  "bg-emerald-500/20 text-emerald-200",
  "bg-sky-500/20 text-sky-200",
  "bg-rose-500/20 text-rose-200",
  "bg-lime-500/20 text-lime-200",
];

const tokenColorPalette = [
  "bg-lime-500 text-black",
  "bg-amber-500 text-black",
  "bg-emerald-400 text-black",
  "bg-rose-400 text-black",
  "bg-cyan-400 text-black",
  "bg-violet-400 text-black",
  "bg-orange-500 text-black",
  "bg-teal-400 text-black",
  "bg-yellow-400 text-black",
  "bg-fuchsia-400 text-black",
];

const baseTextClass = "text-[15px] font-medium tracking-[0.02em]";

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type BottomTab = {
  id: "Wallets" | "Home" | "Sugar";
  label: string;
  icon: (props: { active: boolean }) => ReactNode;
};

const bottomTabs: BottomTab[] = [
  { id: "Wallets", label: "Wallets", icon: WalletTabIcon },
  { id: "Home", label: "Home", icon: HomeTabIcon },
  { id: "Sugar", label: "Sugar", icon: SugarTabIcon },
];

type BottomTabId = BottomTab["id"];

export default function Home() {
  const walletViews = useMemo(
    () =>
      walletRecords.map<WalletView>((wallet, index) => ({
        ...wallet,
        trades: getTradesForWallet(wallet, index),
      })),
    [],
  );

  const [activeBottomTab, setActiveBottomTab] =
    useState<BottomTabId>("Wallets");
  const [walletFilter, setWalletFilter] = useState<WalletFilter>("All");
  const [expandedWallets, setExpandedWallets] = useState<
    Record<string, boolean>
  >({});
  const [selectedWallet, setSelectedWallet] = useState<WalletView | null>(null);
  const [discoverSort, setDiscoverSort] = useState<DiscoverSort>("recent");
  const [isDiscoverSheetOpen, setIsDiscoverSheetOpen] = useState(false);
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);

  const handleToggleWallet = (walletId: string) => {
    setExpandedWallets((prev) => ({
      ...prev,
      [walletId]: !prev[walletId],
    }));
  };

  const handleWalletSelect = (wallet: WalletView) => {
    setSelectedWallet(wallet);
  };

  const handleWalletFilterChange = (nextFilter: WalletFilter) => {
    setWalletFilter(nextFilter);
    setExpandedWallets({});
  };

  const handleBackToWallets = () => {
    setSelectedWallet(null);
  };

  const renderNav = () => {
    if (activeBottomTab !== "Wallets") {
      return (
        <div className="flex flex-1 justify-center">
          <span className={`${baseTextClass} text-white`}>
            {activeBottomTab}
          </span>
        </div>
      );
    }

    if (selectedWallet) {
      return (
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            onClick={handleBackToWallets}
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
        <span className={`text-[24px] font-semibold tracking-[0.02em] text-white`}>Wallets</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#0C0C0C] font-sans text-white">
      <div className="relative flex w-full max-w-[600px] flex-col overflow-hidden bg-[#0C0C0C]">
        <header className="flex h-16 items-center justify-between px-6">
          {renderNav()}
          {activeBottomTab === "Wallets" && !selectedWallet ? (
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

        <main className={`flex-1 overflow-y-auto px-6 pb-28 ${baseTextClass} text-white`}>
          {activeBottomTab === "Wallets" ? (
            selectedWallet ? (
              <div className="flex h-full items-center justify-center text-white">
                wallet detail
              </div>
            ) : (
              <WalletFeed
                wallets={walletViews}
                walletFilter={walletFilter}
                expandedWallets={expandedWallets}
                onToggleWallet={handleToggleWallet}
                onWalletSelect={handleWalletSelect}
                onWalletFilterChange={handleWalletFilterChange}
                discoverSort={discoverSort}
                onDiscoverEllipsis={() => setIsDiscoverSheetOpen(true)}
                onWatchingPlus={() => setIsAddWalletOpen(true)}
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-white">
              {activeBottomTab === "Home" ? "Home" : "Sugar"}
            </div>
          )}
        </main>

        <BottomTabs
          activeTab={activeBottomTab}
          onChange={(tab) => {
            setActiveBottomTab(tab);
            if (tab !== "Wallets") {
              setSelectedWallet(null);
            }
          }}
        />
        <DiscoverSortSheet
          open={isDiscoverSheetOpen}
          selected={discoverSort}
          onSelect={(value) => {
            setDiscoverSort(value);
            setIsDiscoverSheetOpen(false);
          }}
          onClose={() => setIsDiscoverSheetOpen(false)}
        />
        <AddWalletModal open={isAddWalletOpen} onClose={() => setIsAddWalletOpen(false)} />
      </div>
    </div>
  );
}

function WalletFeed({
  wallets,
  walletFilter,
  expandedWallets,
  onToggleWallet,
  onWalletSelect,
  onWalletFilterChange,
  discoverSort,
  onDiscoverEllipsis,
  onWatchingPlus,
}: {
  wallets: WalletView[];
  walletFilter: WalletFilter;
  expandedWallets: Record<string, boolean>;
  onToggleWallet: (walletId: string) => void;
  onWalletSelect: (wallet: WalletView) => void;
  onWalletFilterChange: (filter: WalletFilter) => void;
  discoverSort: DiscoverSort;
  onDiscoverEllipsis: () => void;
  onWatchingPlus: () => void;
}) {
  const [sectionExpansion, setSectionExpansion] = useState<Record<string, boolean>>(
    {},
  );

  const filteredWallets = useMemo(() => {
    if (walletFilter === "All") return wallets;
    if (walletFilter === "Watching") {
      return wallets.filter(
        (wallet) =>
          wallet.status === "Watching" || wallet.status === "Trading",
      );
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

    const autoTrade = filteredWallets.filter(
      (wallet) => wallet.status === "Trading",
    );
    if (autoTrade.length > 0) {
      result.push({ id: "auto-trade", name: "Auto-trade", wallets: autoTrade });
    }

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
        return b.moneyPNL - a.moneyPNL;
      });
      result.push({ id: "discover", name: "Discover", wallets: sorted });
    }

    return result;
  }, [filteredWallets, discoverSort]);

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
                className={`h-9 rounded-[10px] border px-4 transition font-semibold tracking-[0.02em] ${
                  isActive
                    ? "border-transparent bg-white text-black"
                    : "border-[#181818] bg-transparent text-white hover:border-white/20"
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
            const spacingClass = isLast
              ? ""
              : isExpanded
                ? "mb-6"
                : "mb-6";
            return (
              <section
                key={section.id}
                className={spacingClass}
              >
                <div className="flex items-center justify-between mb-2">
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
                  onEllipsis={
                    section.id === "discover"
                      ? onDiscoverEllipsis
                      : undefined
                  }
                  onPlus={
                    section.id === "watching" ? onWatchingPlus : undefined
                  }
                />
                </div>

                <AnimatedList
                  items={section.wallets}
                  expanded={isExpanded}
                  className="space-y-0"
                  renderItem={(wallet) => (
                    <WalletRow
                      wallet={wallet}
                      expanded={Boolean(expandedWallets[wallet.id])}
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

function WalletRow({
  wallet,
  expanded,
  onToggle,
  onSelect,
}: {
  wallet: WalletView;
  expanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
}) {
  const badgeClasses = getBadgeClasses(wallet.name);
  const summary = getTradeSummary(wallet.trades);
  const walletMoney = getMoneyParts(wallet.moneyPNL);
  const walletPercent = getPercentDisplay(wallet.percentPNL);
  const tradeEntries = useMemo(() => {
    const entries: TradeListEntry[] = [];
    if (summary) {
      entries.push({
        kind: "summary",
        id: `${wallet.id}-summary`,
        summary,
      });
    }
    wallet.trades.forEach((trade, index) => {
      entries.push({
        kind: "trade",
        id: `${wallet.id}-${trade.id}-${index}`,
        trade,
      });
    });
    return entries;
  }, [summary, wallet.id, wallet.trades]);
  const hasTradeEntries = tradeEntries.length > 0;

  return (
    <div>
      <div className="group flex items-center gap-0 rounded-2xl transition-colors duration-200 hover:bg-[#181818] active:bg-[#181818]/80">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-white transition"
          aria-label={expanded ? "Hide trades" : "Show trades"}
        >
          <ChevronIndicator direction={expanded ? "down" : "right"} />
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="flex flex-1 items-center justify-between rounded-2xl py-4 text-left transition focus-visible:outline-none"
          aria-label={`Open ${wallet.name}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-[5px] text-[15px] font-semibold text-white ${badgeClasses}`}
            >
              @
            </span>
            <span className={`${baseTextClass} text-white`}>{wallet.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${baseTextClass} text-white`}>
              <span className="text-[#A1A1A1]">{walletMoney.sign}</span>
              {walletMoney.amount}
            </span>
            <span className={`${baseTextClass} text-[#A1A1A1]`}>
              {walletPercent}
            </span>
          </div>
        </button>
      </div>

      {hasTradeEntries && (
        <div className="pl-13">
        <AnimatedList
          items={tradeEntries}
          expanded={expanded}
          className="mt-2 space-y-0"
          getKey={(entry) => entry.id}
            renderItem={(entry) => {
              if (entry.kind === "summary") {
                return (
                  <div
                    className={`flex items-center mb-2 px-0 justify-between ${baseTextClass} text-[#464B55]`}
                  >
                    <span>{entry.summary.tradesLabel}</span>
                    <span>{entry.summary.winRateLabel}</span>
                  </div>
                );
              }
              const trade = entry.trade;
              const tradeMoney = getMoneyParts(trade.pricePNL);
              const tradePercent = getPercentDisplay(trade.percentPNL);
              return (
                <div className="group flex items-center justify-between rounded-2xl py-4 transition-colors duration-200 hover:bg-[#181818] active:bg-[#181818]/80">
                  <div className="flex items-center gap-3">
                    {trade.image ? (
                      <div className="h-5 w-5 overflow-hidden rounded-[5px]">
                        <Image
                          src={trade.image}
                          alt={trade.name}
                          width={20}
                          height={20}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-[5px] text-[15px] font-semibold text-white ${getTokenBadgeClasses(trade.name)}`}
                      >
                        {trade.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className={`${baseTextClass} text-white`}>
                      {trade.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${baseTextClass} text-white`}>
                      <span className="text-[#A1A1A1]">{tradeMoney.sign}</span>
                      {tradeMoney.amount}
                    </span>
                    <span className={`${baseTextClass} text-[#A1A1A1]`}>
                      {tradePercent}
                    </span>
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

function BottomTabs({
  activeTab,
  onChange,
}: {
  activeTab: BottomTabId;
  onChange: (tab: BottomTabId) => void;
}) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0C0C0C]/95 backdrop-blur">
      <div className="flex h-16 items-center justify-around px-8">
        {bottomTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="flex flex-col items-center gap-1"
            >
              <tab.icon active={isActive} />
              <span
                className={`${baseTextClass} ${
                  isActive ? "text-white" : "text-[#A1A1A1]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

type AnimatedListProps<T> = {
  items: T[];
  expanded: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  className?: string;
  enterTotal?: number;
  exitTotal?: number;
};

function AnimatedList<T>({
  items,
  expanded,
  renderItem,
  getKey,
  className,
  enterTotal = 200,
  exitTotal = 220,
}: AnimatedListProps<T>) {
  const count = items.length;
  const enterStep = count > 0 ? enterTotal / count : enterTotal;
  const exitStep = count > 0 ? exitTotal / count : exitTotal;
  const [shouldRender, setShouldRender] = useState(expanded && count > 0);
  const [phase, setPhase] = useState<"enter" | "exit">(
    expanded && count > 0 ? "enter" : "exit",
  );

  useEffect(() => {
    let timeout: number | null = null;
    const frames: number[] = [];

    if (count === 0) {
      frames.push(
        window.requestAnimationFrame(() => {
          setShouldRender(false);
          setPhase("exit");
        }),
      );
    } else if (expanded) {
      frames.push(
        window.requestAnimationFrame(() => {
          setShouldRender(true);
          setPhase("exit");
          frames.push(
            window.requestAnimationFrame(() => {
              setPhase("enter");
            }),
          );
        }),
      );
    } else {
      frames.push(
        window.requestAnimationFrame(() => {
          setPhase("exit");
        }),
      );
      const totalTime = exitStep * Math.max(count, 1) + 2;
      timeout = window.setTimeout(() => setShouldRender(false), totalTime);
    }

    return () => {
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }
      frames.forEach((id) => window.cancelAnimationFrame(id));
    };
  }, [expanded, count, exitStep]);

  if (!shouldRender) {
    return null;
  }

  const containerClass = className ? `flex flex-col ${className}` : "flex flex-col";

  return (
    <div className={containerClass}>
      {items.map((item, index) => {
        const key = getKey(item, index);
        const isEntering = phase === "enter";
        const duration = phase === "exit" ? exitStep : enterStep;
        const delay =
          phase === "exit"
            ? (count - 1 - index) * exitStep
            : index * enterStep;
        return (
          <div
            key={key}
            style={{
              transitionProperty: "opacity, transform",
              transitionDuration: `${duration}ms`,
              transitionDelay: `${delay}ms`,
              opacity: isEntering ? 1 : 0,
              transform: isEntering ? "translateY(0px)" : "translateY(-6px)",
            }}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
}

function SectionActions({
  sectionId,
  onEllipsis,
  onPlus,
}: {
  sectionId: string;
  onEllipsis?: () => void;
  onPlus?: () => void;
}) {
  if (sectionId === "auto-trade") {
    return (
      <div className="flex items-center gap-3 text-[15px] text-[#848484]">
        <EllipsisButton onClick={onEllipsis} />
        <InfoIcon filled />
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

const discoverSortOptions: Array<{ value: DiscoverSort; label: string }> = [
  { value: "recent", label: "Recently added" },
  { value: "top", label: "Top performer" },
];

function DiscoverSortSheet({
  open,
  selected,
  onSelect,
  onClose,
}: {
  open: boolean;
  selected: DiscoverSort;
  onSelect: (value: DiscoverSort) => void;
  onClose: () => void;
}) {
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

function AddWalletModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full"
        aria-label="Close add wallet modal"
      />
      <div className="relative z-10 w-[280px] rounded-3xl bg-[#121214] p-6 text-center shadow-lg shadow-black/50">
        <h2 className="text-[17px] font-semibold tracking-[0.02em] text-white">
          Add a wallet
        </h2>
        <p className="mt-2 text-[14px] tracking-[0.02em] text-[#A1A1A1]">
          Will build this later
        </p>
      </div>
    </div>
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

function InfoIcon({ filled }: { filled?: boolean }) {
  void filled;
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full text-[14px] font-bold text-white bg-white/4">i</div>
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

function WalletTabIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-violet-400" : "text-zinc-500"}`}
      fill="currentColor"
    >
      <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25zm2.75-.25a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75v-2.25h-3a2.75 2.75 0 0 1-2.75-2.75A2.75 2.75 0 0 1 14.25 9h3V7.25a.75.75 0 0 0-.75-.75zM17.25 10.5h-3a1.25 1.25 0 1 0 0 2.5h3z" />
    </svg>
  );
}

function HomeTabIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-zinc-100" : "text-zinc-500"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5.5 10v9h5v-5h3v5h5v-9" />
    </svg>
  );
}

function SugarTabIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-pink-400" : "text-zinc-500"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4c1.7-2.667 6-2.667 7.7 0 1.7 2.667.75 6.4-3.7 9.2l-4 2.5-4-2.5C3.55 10.4 2.6 6.667 4.3 4 6 1.333 10.3 1.333 12 4z" />
      <path d="M7 13l5 7 5-7" />
    </svg>
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

function ChevronIndicator({ direction }: { direction: "right" | "down" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[14px] w-[14px] transform text-white transition-transform duration-200 ${
        direction === "down" ? "rotate-90" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 5l8 7-8 7" />
    </svg>
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

function getBadgeClasses(handle: string) {
  const sum = handle
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return badgePalette[sum % badgePalette.length];
}

function getTokenBadgeClasses(name: string) {
  const sum = name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return tokenColorPalette[sum % tokenColorPalette.length];
}

function getMoneyParts(value: number) {
  const sign = value >= 0 ? "+" : "-";
  const amount = moneyFormatter.format(Math.abs(value));
  return { sign, amount };
}

function getPercentDisplay(value: number) {
  const sign = value >= 0 ? "+" : "-";
  return `(${sign}${Math.abs(value)}%)`;
}

function getTradesForWallet(wallet: WalletRecord, index: number): TokenRecord[] {
  const start = (index * 3 + wallet.name.length) % tokenRecords.length;
  const trades: TokenRecord[] = [];

  for (let offset = 0; offset < 5; offset += 1) {
    trades.push(tokenRecords[(start + offset) % tokenRecords.length]);
  }

  return trades;
}

function getTradeSummary(trades: TokenRecord[]): TradeSummaryInfo | null {
  if (trades.length === 0) return null;

  const wins = trades.filter((trade) => trade.pricePNL >= 0).length;
  const winRate = Math.round((wins / trades.length) * 100);

  return {
    tradesLabel: `${trades.length} trades`,
    winRateLabel: `${winRate}% win rate`,
  };
}
