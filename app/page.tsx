"use client";

import { useMemo, useState } from "react";

import { walletRecords } from "./data";
import {
  baseTextClass,
  type DiscoverSort,
  type WalletFilter,
  type WalletView,
} from "./features/wallets/constants";
import { getTradesForWallet } from "./features/wallets/utils";
import { AddWalletModal } from "./features/wallets/components/AddWalletModal";
import { BottomTabs, type BottomTabId } from "./features/wallets/components/BottomTabs";
import { DiscoverSortSheet } from "./features/wallets/components/DiscoverSortSheet";
import { WalletFeed } from "./features/wallets/components/WalletFeed";
import { WalletHeader } from "./features/wallets/components/WalletHeader";

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

  const showWalletTab = activeBottomTab === "Wallets";

  return (
    <div className="flex min-h-screen justify-center bg-[#0C0C0C] font-sans text-white">
      <div className="relative flex w-full max-w-[600px] flex-col overflow-hidden bg-[#0C0C0C]">
        <WalletHeader
          activeTab={activeBottomTab}
          selectedWallet={selectedWallet}
          onBack={handleBackToWallets}
        />

        <main className={`flex-1 overflow-y-auto px-6 pb-28 ${baseTextClass} text-white`}>
          {showWalletTab ? (
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

        <AddWalletModal
          open={isAddWalletOpen}
          onClose={() => setIsAddWalletOpen(false)}
        />
      </div>
    </div>
  );
}
