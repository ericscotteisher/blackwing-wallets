"use client";

import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";

import { timeframes, type Timeframe, type WalletView } from "../constants";
import { getMoneyParts, getTradeSummary, getWalletDisplayName } from "../utils";

type WalletDetailProps = {
  wallet: WalletView;
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  onCopyTradeToggle: (nextValue: boolean) => void;
  onStatsOpen: (wallet: WalletView, timeframe: Timeframe) => void;
};

const timeframeLabels: Record<Timeframe, string> = {
  "1d": "1d",
  "7d": "7d",
  "30d": "30d",
  "1yr": "1y",
};

type Position = {
  id: string;
  name: string;
  meta: string;
  amountLabel: string;
  change: number;
  rightSecondary?: string;
};

const openPositions: Position[] = [
  {
    id: "goblin-ai",
    name: "Goblin AI Agent",
    meta: "25s ago · Owned by you",
    change: 3.45,
    amountLabel: "+$8.73",
  },
  {
    id: "snot-coins-open",
    name: "Snot coins",
    meta: "4m ago",
    change: -1.98,
    amountLabel: "-$6.24",
  },
  {
    id: "goblin-gold",
    name: "Goblin gold",
    meta: "3d ago",
    change: 2.47,
    amountLabel: "+$12.32",
  },
];

const closedPositions: Position[] = [
  {
    id: "snot-coins-1",
    name: "Snot coins",
    meta: "Jul 30 · 12:45pm",
    change: 0,
    amountLabel: "+$145.67",
    rightSecondary: "350 @ $620.5K",
  },
  {
    id: "snot-coins-2",
    name: "Snot coins",
    meta: "Jul 30 · 12:45pm",
    change: 0,
    amountLabel: "+$98.32",
    rightSecondary: "480 @ $800.2K",
  },
  {
    id: "stinky-monkey",
    name: "Stinky monkey",
    meta: "Jul 30 · 12:45pm",
    change: 0,
    amountLabel: "+$76.45",
    rightSecondary: "390 @ $710.8K",
  },
  {
    id: "money-printer",
    name: "Money printer",
    meta: "Jul 30 · 12:45pm",
    change: 0,
    amountLabel: "+$132.89",
    rightSecondary: "450 @ $900.1K",
  },
  {
    id: "washy",
    name: "Washy washington",
    meta: "Jul 30 · 12:45pm",
    change: 0,
    amountLabel: "+$110.54",
    rightSecondary: "500 @ $850.4K",
  },
];

export function WalletDetail({
  wallet,
  timeframe,
  onTimeframeChange,
  onCopyTradeToggle,
  onStatsOpen,
}: WalletDetailProps) {
  const [sectionExpansion, setSectionExpansion] = useState<Record<string, boolean>>({
    positions: true,
    closed: true,
  });
  const [isCopyConfirmOpen, setIsCopyConfirmOpen] = useState(false);
  const [isTradeSettingsOpen, setIsTradeSettingsOpen] = useState(false);
  const [sellWithWallet, setSellWithWallet] = useState(true);

  const summary = useMemo(
    () => getTradeSummary(wallet.trades, timeframe),
    [wallet.trades, timeframe],
  );
  const tradesCount = wallet.trades.length;
  const yearlyBalance = 250 + wallet.pnl["1yr"].money;
  const balanceParts = getBalanceParts(yearlyBalance);
  const timeframePnl = wallet.pnl[timeframe];
  const timeframeMoneyParts = getMoneyParts(timeframePnl.money);
  const displayName = getWalletDisplayName(wallet);
  const addressPreview = (wallet.address ?? wallet.name).slice(0, 6);

  const sections = [
    {
      id: "positions",
      name: `${displayName}'s positions`,
      positions: openPositions,
    },
    {
      id: "closed",
      name: "Closed positions",
      positions: closedPositions,
    },
  ];

  const handleSectionToggle = (sectionId: string) => {
    setSectionExpansion((prev) => ({
      ...prev,
      [sectionId]: !(prev[sectionId] ?? true),
    }));
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="text-[32px] font-semibold tracking-[0.02em] text-white px-5">
          <span className="text-white">
            {balanceParts.sign && <span>{balanceParts.sign}</span>}
            <span>${balanceParts.int}</span>
          </span>
          <span className="text-[#848484]">.{balanceParts.frac}</span>
        </p>
        <div className="mt-0 flex items-center justify-between gap-3 px-5">
          <div className="flex flex-1 flex-wrap items-baseline gap-1 text-[15px] font-medium tracking-[0.02em]">
            <span className="text-[#4B31F2]">
              <span>{timeframeMoneyParts.sign}</span>
              {timeframeMoneyParts.amount}
            </span>
            <span className="text-[#4B31F2]">
              (
              {formatPercent(timeframePnl.percent)}
              )
            </span>
            <span className="text-[14px] text-[#848484]">
              {timeframeLabels[timeframe]}
            </span>
          </div>
          <DetailTimeframeSelector current={timeframe} onSelect={onTimeframeChange} />
        </div>
      </div>

      <DetailChart />

      <div className="grid grid-cols-3 gap-3 px-5">
        <StatBlock label="Trades" value={tradesCount.toString()} />
        <StatBlock
          label="Win rate"
          value={
            summary
              ? summary.winRateLabel.replace(" wins", "")
              : "80%"
          }
        />
        <button
          type="button"
          onClick={() => onStatsOpen(wallet, timeframe)}
          className="flex h-full items-center justify-center rounded-[10px] border border-[#1E2025] text-center text-[14px] font-medium tracking-[0.02em] text-[#848484] transition hover:border-white/20"
        >
          See stats
        </button>
      </div>

      <div className="flex items-center gap-3 px-5">
        <SocialButton label="Twitter" iconSrc="/icons/social-x.png" />
        <SocialButton label="Telegram" iconSrc="/icons/social-telegram.png" />
      </div>

      <div className="px-5">
        <CopyTradeCard
          active={wallet.isAutoTrade}
          onToggle={(next) => {
            if (next) {
              onCopyTradeToggle(true);
              setIsCopyConfirmOpen(true);
            } else {
              onCopyTradeToggle(false);
            }
          }}
          onActivePress={() => setIsTradeSettingsOpen(true)}
        />
        {!wallet.isAutoTrade && (
          <button
            type="button"
            onClick={() => setIsTradeSettingsOpen(true)}
            className="mt-3 flex h-[44px] w-full items-center justify-center rounded-[10px] border border-[#222222] px-4 text-left text-[16px] font-medium text-white transition hover:bg-[#1f1f1f]"
          >
            Trade settings
          </button>
        )}
      </div>

      <div className="space-y-0">
        {sections.map((section) => {
          const isOpen = sectionExpansion[section.id] ?? true;
          return (
            <div key={section.id} className="border-t border-[#1E2025] py-8 px-5">
              <button
                type="button"
                onClick={() => handleSectionToggle(section.id)}
                className="flex w-full items-center gap-2 text-left"
              >
                <span className="text-[14px] font-medium tracking-[0.02em] text-[#848484]">
                  {section.name}
                </span>
                <CaretIcon open={isOpen} />
              </button>
              {isOpen && (
                <div className="mt-5 space-y-7">
                  {section.positions.map((position) => (
                    <PositionRow key={position.id} position={position} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isCopyConfirmOpen && (
        <BottomSheet onClose={() => setIsCopyConfirmOpen(false)}>
          <h2 className="text-[20px] font-medium tracking-[0.02em] text-white">
            You’re copying this wallet
          </h2>
          <p className="mt-3 text-[16px] font-medium text-[#848484]">
            Any time this wallet buys or sells a token your account will follow.
          </p>
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsCopyConfirmOpen(false);
                setIsTradeSettingsOpen(true);
              }}
              className="h-12 w-full rounded-[10px] border border-white/20 text-[16px] font-semibold text-white"
            >
              Adjust settings
            </button>
            <button
              type="button"
              onClick={() => setIsCopyConfirmOpen(false)}
              className="h-12 w-full rounded-[10px] bg-[#222222] text-[16px] font-semibold text-white"
            >
              Close
            </button>
          </div>
        </BottomSheet>
      )}

      {isTradeSettingsOpen && (
        <BottomSheet onClose={() => setIsTradeSettingsOpen(false)}>
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-medium text-white">@{addressPreview}</span>
          </div>
          <h2 className="mt-4 text-[24px] font-medium tracking-[0.02em] text-white">
            Trade settings
          </h2>
          {/* First section */}
          <div className="mt-6 bg-[#181818] items-center justify-center px-4 rounded-xl">
            <SettingsRow
              label="Enable auto trade"
              control={
                <InlineToggle
                  value={wallet.isAutoTrade}
                  onChange={(value) => {
                    if (value) {
                      onCopyTradeToggle(true);
                      setIsCopyConfirmOpen(true);
                    } else {
                      onCopyTradeToggle(false);
                    }
                  }}
                />
              }
            />
            </div>
            {/* Second section */}
            <div className="mt-6 bg-[#181818] items-center justify-center px-4 rounded-xl">
            <SettingsRow
              label="Buy size"
              control={
                <span className="flex items-center gap-2 text-[15px] text-white">
                  up to 1 SOL
                  <ChevronRightIcon />
                </span>
              }
            />
            <SettingsRow
              label="Take profit"
              control={
                <span className="flex items-center gap-2 text-[15px] text-white">
                  +15% (trailing)
                  <ChevronRightIcon />
                </span>
              }
            />
            <SettingsRow
              label="Stop loss"
              control={
                <span className="flex items-center gap-2 text-[15px] text-white">
                  -25%
                  <ChevronRightIcon />
                </span>
              }
            />
            <SettingsRow
              label="Sell with wallet"
              control={
                <InlineToggle
                  value={sellWithWallet}
                  onChange={(value) => setSellWithWallet(value)}
                />
              }
            />
          </div>
          <div className="mt-6 space-y-2 text-[13px] text-[#848484]">
            <p>
              • By enabling auto-trading, you allow Daddy to trade for you. Trades carry risk and
              may not be profitable.
            </p>
            <p>
              • Sell with wallet mirrors the wallet’s sell %, even if it differs from your own sell
              settings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsTradeSettingsOpen(false)}
            className="mt-6 h-12 w-full rounded-[10px] bg-[#222222] text-[16px] font-semibold text-white"
          >
            Close
          </button>
        </BottomSheet>
      )}
    </div>
  );
}

function DetailTimeframeSelector({
  current,
  onSelect,
}: {
  current: Timeframe;
  onSelect: (timeframe: Timeframe) => void;
}) {
  return (
    <div className="flex text-[13px]">
      {timeframes.map((tf) => {
        const isActive = current === tf;
        return (
          <button
            key={tf}
            type="button"
            onClick={() => onSelect(tf)}
            className={`px-2 py-[3px] text-[14px] font-medium tracking-[0.02em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 ${
              isActive ? "rounded-[8px] bg-[#32353D] text-white" : "rounded-[8px] bg-transparent text-[#AFAFAF] hover:text-white"
            }`}
          >
            {tf}
          </button>
        );
      })}
    </div>
  );
}

function DetailChart() {
  return (
    <div className="w-full border-b border-[#1E2025]">
      <Image
        src="/Chart-v2.png"
        alt="Wallet performance chart"
        width={1125}
        height={465}
        className="h-auto w-full"
        priority
      />
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0 text-center">
      <p className="text-[14px] font-medium tracking-[0.02em] text-[#848484]">
        {label}
      </p>
      <p className="text-[16px] font-medium tracking-[0.02em] text-white">{value}</p>
    </div>
  );
}

function SocialButton({ label, iconSrc }: { label: string; iconSrc: string }) {
  return (
    <button
      type="button"
      className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#1E2025] py-2 text-[14px] font-medium tracking-[0.02em] text-[#848484] transition hover:border-white/20"
    >
      <Image
        src={iconSrc}
        alt={`${label} icon`}
        width={20}
        height={20}
        className="h-5 w-5 rounded-[5px]"
      />
      {label}
    </button>
  );
}

function CopyTradeCard({
  active,
  onToggle,
  onActivePress,
}: {
  active: boolean;
  onToggle: (nextValue: boolean) => void;
  onActivePress: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (active) {
          onActivePress();
        } else {
          onToggle(true);
        }
      }}
      className={`mb-2 flex min-h-[44px] w-full items-center justify-center rounded-[10px] px-5 text-left transition ${
        active ? "bg-[#181818] hover:bg-[#1f1f1f]" : "bg-[#4B31F2] hover:bg-[#452DDB]"
      }`}
    >
      <div>
        <p className="text-[16px] font-semibold tracking-[0.02em] text-white">
          {active ? "Copy trade enabled" : "Enable copy trade"}
        </p>
      </div>
    </button>
  );
}

function PositionRow({ position }: { position: Position }) {
  const changeLabel =
    position.change === 0
      ? position.amountLabel
      : `${position.change > 0 ? "+" : ""}${position.change.toFixed(2)}%`;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#1F1F21] text-[15px] font-semibold text-white">
          {position.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-white">{position.name}</p>
          <p className="text-[15px] text-[#848484]">{position.meta}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[15px] font-semibold text-white">
          {position.rightSecondary ?? position.amountLabel}
        </p>
        <p className="text-[15px] text-[#848484]">{changeLabel}</p>
      </div>
    </div>
  );
}

function CaretIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 text-[#464B55] transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
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

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-[#848484]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 6l6 6-6 6" />
    </svg>
  );
}

function InlineToggle({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-6 w-[52px] rounded-full transition ${
        value ? "bg-[#4B4BFB]" : "bg-[#414141]"
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow transition ${
          value ? "translate-x-[6px]" : "translate-x-[-22px]"
        }`}
      />
    </button>
  );
}

function SettingsRow({
  label,
  control,
}: {
  label: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b py-4 border-white/10 last:border-b-0">
      <span className="text-[15px] text-white">{label}</span>
      <div className="flex items-center gap-2">{control}</div>
    </div>
  );
}

function BottomSheet({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-[520px] rounded-3xl border border-white/10 bg-[#111111] p-6">
        {children}
      </div>
    </div>
  );
}

const balanceNumberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function getBalanceParts(value: number) {
  const formatted = balanceNumberFormatter.format(Math.abs(value));
  const [intPart, frac = "00"] = formatted.split(".");
  return { sign: value < 0 ? "-" : "", int: intPart, frac };
}

function formatPercent(value: number) {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}
