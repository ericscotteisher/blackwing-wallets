import {
  tokenRecords,
  type Timeframe,
  type TokenRecord,
  type WalletRecord,
} from "../../data";
import {
  badgePalette,
  tokenColorPalette,
  type TradeSummaryInfo,
  type WalletView,
} from "./constants";

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function getBadgeClasses(handle: string) {
  const sum = handle
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return badgePalette[sum % badgePalette.length];
}

export function getTokenBadgeClasses(name: string) {
  const sum = name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return tokenColorPalette[sum % tokenColorPalette.length];
}

export function getMoneyParts(value: number) {
  const sign = value >= 0 ? "+" : "-";
  const amount = moneyFormatter.format(Math.abs(value));
  return { sign, amount };
}

export function getPercentDisplay(value: number) {
  const sign = value >= 0 ? "+" : "-";
  return `(${sign}${Math.abs(value)}%)`;
}

export function getTradesForWallet(wallet: WalletRecord, index: number): TokenRecord[] {
  const start = (index * 3 + wallet.name.length) % tokenRecords.length;
  const trades: TokenRecord[] = [];

  for (let offset = 0; offset < 5; offset += 1) {
    trades.push(tokenRecords[(start + offset) % tokenRecords.length]);
  }

  return trades;
}

export function getTradeSummary(
  trades: TokenRecord[],
  timeframe: Timeframe,
): TradeSummaryInfo | null {
  if (trades.length === 0) return null;

  const wins = trades.filter((trade) => trade.pnl[timeframe].money >= 0).length;
  const winRate = Math.round((wins / trades.length) * 100);

  return {
    tradesLabel: `${trades.length} trades`,
    winRateLabel: `${winRate}% wins`,
  };
}

export function getWalletDisplayName(wallet: WalletView) {
  if (wallet.alias && wallet.alias.trim().length > 0) {
    return wallet.alias.trim();
  }
  return wallet.name;
}
