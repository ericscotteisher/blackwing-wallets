"use client";

import { useMemo, useState } from "react";

import { walletRecords } from "./data";
import {
  baseTextClass,
  type DiscoverSort,
  type WalletFilter,
  type Timeframe,
  type WalletView,
  type WatchingSort,
} from "./features/wallets/constants";
import { getTradesForWallet } from "./features/wallets/utils";
import { AddWalletModal } from "./features/wallets/components/AddWalletModal";
import { BottomTabs, type BottomTabId } from "./features/wallets/components/BottomTabs";
import { DiscoverSortSheet } from "./features/wallets/components/DiscoverSortSheet";
import { WalletDetail } from "./features/wallets/components/WalletDetail";
import { WalletFeed } from "./features/wallets/components/WalletFeed";
import { WalletHeader } from "./features/wallets/components/WalletHeader";
import { WatchingSortSheet } from "./features/wallets/components/WatchingSortSheet";

export default function Home() {
  const [walletViews, setWalletViews] = useState<WalletView[]>(() =>
    walletRecords.map<WalletView>((wallet, index) => ({
      ...wallet,
      trades: getTradesForWallet(wallet, index),
    })),
  );

  const [activeBottomTab, setActiveBottomTab] =
    useState<BottomTabId>("Wallets");
  const [walletFilter, setWalletFilter] = useState<WalletFilter>("All");
  const [expandedWallets, setExpandedWallets] = useState<
    Record<string, boolean>
  >({});
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<Timeframe>("1d");
  const [discoverSort, setDiscoverSort] = useState<DiscoverSort>("recent");
  const [watchingSort, setWatchingSort] = useState<WatchingSort>("top");
  const [isDiscoverSheetOpen, setIsDiscoverSheetOpen] = useState(false);
  const [isWatchingSheetOpen, setIsWatchingSheetOpen] = useState(false);
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);

  const selectedWallet = useMemo(
    () => walletViews.find((wallet) => wallet.id === selectedWalletId) ?? null,
    [walletViews, selectedWalletId],
  );

  const handleToggleWallet = (walletId: string) => {
    setExpandedWallets((prev) => ({
      ...prev,
      [walletId]: !prev[walletId],
    }));
  };

  const handleWalletSelect = (wallet: WalletView) => {
    setSelectedWalletId(wallet.id);
  };

  const handleWalletFilterChange = (nextFilter: WalletFilter) => {
    setWalletFilter(nextFilter);
    setExpandedWallets({});
  };

  const handleBackToWallets = () => {
    setSelectedWalletId(null);
  };

  const handleWatchingToggle = (walletId: string, nextValue: boolean) => {
    setWalletViews((prev) =>
      prev.map((wallet) => {
        if (wallet.id !== walletId) return wallet;
        const nextAutoTrade = nextValue ? wallet.isAutoTrade : false;
        return {
          ...wallet,
          isWatching: nextValue || nextAutoTrade,
          isAutoTrade: nextAutoTrade,
        };
      }),
    );
  };

  const handleAutoTradeToggle = (walletId: string, nextValue: boolean) => {
    setWalletViews((prev) =>
      prev.map((wallet) => {
        if (wallet.id !== walletId) return wallet;
        return {
          ...wallet,
          isAutoTrade: nextValue,
          isWatching: nextValue ? true : wallet.isWatching,
        };
      }),
    );
  };

  const showWalletTab = activeBottomTab === "Wallets";

  return (
    <div className="flex min-h-screen justify-center bg-[#0C0C0C] font-sans text-white">
      <div className="flex min-h-screen w-full max-w-[600px] flex-col bg-[#0C0C0C]">
        <WalletHeader
          activeTab={activeBottomTab}
          selectedWallet={selectedWallet}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          onBack={handleBackToWallets}
        />

        <main className={`flex-1 overflow-y-auto px-6 pb-8 ${baseTextClass} text-white`}>
          {showWalletTab ? (
            selectedWallet ? (
              <WalletDetail
                wallet={selectedWallet}
                onWatchingChange={(value) => handleWatchingToggle(selectedWallet.id, value)}
                onAutoTradeChange={(value) => handleAutoTradeToggle(selectedWallet.id, value)}
              />
            ) : (
              <WalletFeed
                wallets={walletViews}
                walletFilter={walletFilter}
                expandedWallets={expandedWallets}
                timeframe={selectedTimeframe}
                watchingSort={watchingSort}
                onToggleWallet={handleToggleWallet}
                onWalletSelect={handleWalletSelect}
                onWalletFilterChange={handleWalletFilterChange}
                discoverSort={discoverSort}
                onDiscoverEllipsis={() => setIsDiscoverSheetOpen(true)}
                onWatchingEllipsis={() => setIsWatchingSheetOpen(true)}
                onWatchingPlus={() => setIsAddWalletOpen(true)}
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-white">
              {activeBottomTab === "Discover" ? "Discover" : "Sugar"}
            </div>
          )}
        </main>

        <BottomTabs
          activeTab={activeBottomTab}
          onChange={(tab) => {
            setActiveBottomTab(tab);
            if (tab !== "Wallets") {
              setSelectedWalletId(null);
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

        <WatchingSortSheet
          open={isWatchingSheetOpen}
          selected={watchingSort}
          onSelect={(value) => {
            setWatchingSort(value);
            setIsWatchingSheetOpen(false);
          }}
          onClose={() => setIsWatchingSheetOpen(false)}
        />

        <AddWalletModal
          open={isAddWalletOpen}
          onClose={() => setIsAddWalletOpen(false)}
        />
      </div>
    </div>
  );
}
