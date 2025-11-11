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
import { WalletStatsSheet } from "./features/wallets/components/WalletStatsSheet";
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
  const [pendingUnfollowWalletId, setPendingUnfollowWalletId] = useState<string | null>(
    null,
  );
  const [statsTarget, setStatsTarget] = useState<{
    wallet: WalletView;
    timeframe: Timeframe;
  } | null>(null);

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

  const updateWalletViews = (walletId: string, updater: (wallet: WalletView) => WalletView) => {
    setWalletViews((prev) =>
      prev.map((wallet) => {
        if (wallet.id !== walletId) return wallet;
        return updater(wallet);
      }),
    );
  };

  const applyWatchingState = (walletId: string, nextValue: boolean) => {
    updateWalletViews(walletId, (wallet) => {
      if (nextValue) {
        return { ...wallet, isWatching: true };
      }
      return { ...wallet, isWatching: false, isAutoTrade: false };
    });
  };

  const requestWatchingToggle = (wallet: WalletView, nextValue: boolean) => {
    if (!nextValue && wallet.isAutoTrade) {
      setPendingUnfollowWalletId(wallet.id);
      return;
    }
    applyWatchingState(wallet.id, nextValue);
  };

  const handleCopyTradeToggle = (walletId: string, nextValue: boolean) => {
    updateWalletViews(walletId, (wallet) => {
      if (nextValue) {
        return { ...wallet, isAutoTrade: true, isWatching: true };
      }
      return { ...wallet, isAutoTrade: false };
    });
  };

  const pendingUnfollowWallet = pendingUnfollowWalletId
    ? walletViews.find((wallet) => wallet.id === pendingUnfollowWalletId) ?? null
    : null;

  const handleConfirmUnfollow = () => {
    if (!pendingUnfollowWalletId) return;
    applyWatchingState(pendingUnfollowWalletId, false);
    setPendingUnfollowWalletId(null);
  };

  const handleShareWallet = async (wallet: WalletView | null) => {
    if (!wallet || typeof navigator === "undefined") return;
    const sharePayload = {
      title: `${wallet.name} wallet`,
      text: `Check out ${wallet.name} on Blackwing`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
      } catch {
        // ignore for now
      }
      return;
    }
    try {
      await navigator.clipboard?.writeText(sharePayload.url ?? "");
    } catch {
      // ignore
    }
  };

  const handleStatsOpen = (wallet: WalletView, timeframe: Timeframe) => {
    setStatsTarget({ wallet, timeframe });
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
          isWatchingSelectedWallet={selectedWallet?.isWatching}
          onToggleSelectedWalletWatch={
            selectedWallet
              ? () => requestWatchingToggle(selectedWallet, !selectedWallet.isWatching)
              : undefined
          }
          onShareSelectedWallet={() => handleShareWallet(selectedWallet)}
          onBack={handleBackToWallets}
        />

        <main className={`flex-1 overflow-y-auto px-0 pb-8 ${baseTextClass} text-white`}>
          {showWalletTab ? (
            selectedWallet ? (
              <WalletDetail
                wallet={selectedWallet}
                timeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
                onCopyTradeToggle={(value) => handleCopyTradeToggle(selectedWallet.id, value)}
                onStatsOpen={handleStatsOpen}
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
                onSeeStats={handleStatsOpen}
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

        {pendingUnfollowWallet && (
          <ConfirmSheet
            walletName={pendingUnfollowWallet.name}
            onCancel={() => setPendingUnfollowWalletId(null)}
            onConfirm={handleConfirmUnfollow}
          />
        )}

        {statsTarget && (
          <WalletStatsSheet
            key={`${statsTarget.wallet.id}-${statsTarget.timeframe}`}
            open
            walletName={statsTarget.wallet.name}
            timeframe={statsTarget.timeframe}
            onClose={() => setStatsTarget(null)}
          />
        )}
      </div>
    </div>
  );
}

function ConfirmSheet({
  walletName,
  onCancel,
  onConfirm,
}: {
  walletName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-5 pb-8">
      <div className="w-full max-w-[500px] rounded-3xl border border-white/10 bg-[#111111] p-6">
        <p className="text-[18px] font-semibold tracking-[0.02em] text-white">
          Turn off copy trades?
        </p>
        <p className="mt-2 text-[15px] text-[#A1A1A1]">
          Unfollowing {walletName} will disable copy trading for this wallet. Are you sure?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-white/20 px-5 py-3 text-center text-[15px] font-semibold text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-[#4B31F2] px-5 py-3 text-center text-[15px] font-semibold text-white"
          >
            Unfollow
          </button>
        </div>
      </div>
    </div>
  );
}
