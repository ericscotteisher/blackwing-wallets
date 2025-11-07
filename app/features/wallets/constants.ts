import { timeframes } from "../../data";
import type {
  Timeframe,
  TokenRecord,
  WalletRecord,
  WalletStatus,
} from "../../data";

export const walletFilterTabs = ["All", "Watching", "KOLs", "Whales", "Alpha"] as const;
export type WalletFilter = (typeof walletFilterTabs)[number];

export type DiscoverSort = "recent" | "top";
export type WatchingSort = "top" | "recent" | "auto";

export type WalletView = WalletRecord & {
  trades: TokenRecord[];
};

export type WalletSectionId = "auto-trade" | "watching" | "discover";

export type Section = {
  id: string;
  kind: WalletSectionId;
  name: string;
  wallets: WalletView[];
};

export type TradeSummaryInfo = {
  tradesLabel: string;
  winRateLabel: string;
};

export type TradeListEntry =
  | { kind: "summary"; id: string; summary: TradeSummaryInfo }
  | { kind: "trade"; id: string; trade: TokenRecord };

export type WalletSwipeAction = {
  id: string;
  label: string;
  tone: "default" | "positive" | "negative";
};

export { timeframes };
export type { Timeframe };

export const discoverStatuses: WalletStatus[] = ["KOL", "Whale", "Alpha"];

export const walletSwipeActions: Record<WalletSectionId, WalletSwipeAction[]> = {
  "auto-trade": [
    { id: "disable-auto", label: "- auto", tone: "negative" },
    { id: "adjust-settings", label: "adjust settings", tone: "default" },
  ],
  watching: [
    { id: "enable-auto", label: "+ auto", tone: "positive" },
    { id: "unfollow", label: "unfollow", tone: "default" },
  ],
  discover: [
    { id: "follow", label: "follow", tone: "positive" },
    { id: "enable-auto", label: "+ auto", tone: "positive" },
    { id: "block", label: "block", tone: "negative" },
  ],
};

export const actionToneClasses: Record<WalletSwipeAction["tone"], string> = {
  default: "bg-[#1F1F1F] text-white",
  positive: "bg-[#2157FF] text-white",
  negative: "bg-[#FF4D57] text-white",
};

export const actionRevealOffsetPx = 40;
export const actionRevealWindowPx = 40;
export const actionMinScale = 0.2;

export const badgePalette = [
  "bg-amber-500/20 text-amber-200",
  "bg-violet-500/20 text-violet-200",
  "bg-emerald-500/20 text-emerald-200",
  "bg-sky-500/20 text-sky-200",
  "bg-rose-500/20 text-rose-200",
  "bg-lime-500/20 text-lime-200",
];

export const tokenColorPalette = [
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

export const baseTextClass = "text-[15px] font-medium tracking-[0.02em]";
