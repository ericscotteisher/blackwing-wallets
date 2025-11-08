"use client";

import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";

import { timeframes, type Timeframe, type WalletView } from "../constants";
import { getMoneyParts, getTradeSummary } from "../utils";

type WalletDetailProps = {
  wallet: WalletView;
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  onWatchingToggle: (nextValue: boolean) => void;
  onCopyTradeToggle: (nextValue: boolean) => void;
};

const chartPoints = [40, 80, 46, 120, 96, 140, 110, 150, 136, 156];

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
    meta: "Jul 30 · 12:45pm · 350 @ $620.5K",
    change: 0,
    amountLabel: "+$145.67",
    rightSecondary: "350 @ $620.5K",
  },
  {
    id: "snot-coins-2",
    name: "Snot coins",
    meta: "Jul 30 · 12:45pm · 480 @ $800.2K",
    change: 0,
    amountLabel: "+$98.32",
    rightSecondary: "480 @ $800.2K",
  },
  {
    id: "stinky-monkey",
    name: "Stinky monkey",
    meta: "Jul 30 · 12:45pm · 390 @ $710.8K",
    change: 0,
    amountLabel: "+$76.45",
    rightSecondary: "390 @ $710.8K",
  },
  {
    id: "money-printer",
    name: "Money printer",
    meta: "Jul 30 · 12:45pm · 450 @ $900.1K",
    change: 0,
    amountLabel: "+$132.89",
    rightSecondary: "450 @ $900.1K",
  },
  {
    id: "washy",
    name: "Washy washington",
    meta: "Jul 30 · 12:45pm · 500 @ $850.4K",
    change: 0,
    amountLabel: "+$110.54",
    rightSecondary: "500 @ $850.4K",
  },
];

export function WalletDetail({
  wallet,
  timeframe,
  onTimeframeChange,
  onWatchingToggle,
  onCopyTradeToggle,
}: WalletDetailProps) {
  const [sectionExpansion, setSectionExpansion] = useState<Record<string, boolean>>({
    positions: true,
    closed: true,
  });

  const pnl = wallet.pnl[timeframe];
  const summary = useMemo(
    () => getTradeSummary(wallet.trades, timeframe),
    [wallet.trades, timeframe],
  );
  const tradesCount = wallet.trades.length;
  const balance = 250 + pnl.money;
  const balanceParts = getBalanceParts(balance);
  const pnlParts = getMoneyParts(pnl.money);

  const sections = [
    {
      id: "positions",
      name: `${wallet.name}'s positions`,
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
    <div className="space-y-6 py-8">
      <div>
        <p className="text-[32px] font-semibold tracking-[0.02em] text-white">
          <span>${balanceParts.int}</span>
          <span className="text-[#848484]">.{balanceParts.frac}</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[15px] font-semibold tracking-[0.02em] text-white">
          <span>
            <span className="text-[#A1A1A1]">{pnlParts.sign}</span>
            {pnlParts.amount}
          </span>
          <span className="text-[#848484]">{timeframeLabels[timeframe]}</span>
          <DetailTimeframeSelector current={timeframe} onSelect={onTimeframeChange} />
        </div>
      </div>

      <DetailChart />

      <div className="grid grid-cols-3 gap-3">
        <StatBlock label="Trades" value={tradesCount.toString()} />
        <StatBlock
          label="Win rate"
          value={
            summary
              ? summary.winRateLabel.replace(" win rate", "")
              : "80%"
          }
        />
        <button
          type="button"
          className="rounded-2xl border border-white/15 px-4 py-3 text-center text-[14px] font-semibold tracking-[0.02em] text-white transition hover:border-white/40"
        >
          See stats
        </button>
      </div>

      <div className="flex items-center gap-3">
        <SocialButton label="X" icon={<XIcon />} />
        <SocialButton label="Telegram" icon={<TelegramIcon />} />
      </div>

      <CopyTradeCard
        active={wallet.isAutoTrade}
        onToggle={onCopyTradeToggle}
        onWatchingToggle={onWatchingToggle}
        isWatching={wallet.isWatching}
      />

      <div className="space-y-4">
        {sections.map((section) => {
          const isOpen = sectionExpansion[section.id] ?? true;
          return (
            <div
              key={section.id}
              className="rounded-2xl border border-white/10 bg-[#0F0F10]/90 px-4 py-2"
            >
              <button
                type="button"
                onClick={() => handleSectionToggle(section.id)}
                className="flex w-full items-center justify-between py-2 text-left"
              >
                <span className="text-[15px] font-semibold tracking-[0.02em] text-white">
                  {section.name}
                </span>
                <CaretIcon open={isOpen} />
              </button>
              {isOpen && (
                <div className="divide-y divide-white/5">
                  {section.positions.map((position) => (
                    <PositionRow key={position.id} position={position} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
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
    <div className="flex rounded-[10px] bg-white/5 p-1 text-[13px]">
      {timeframes.map((tf) => {
        const isActive = current === tf;
        return (
          <button
            key={tf}
            type="button"
            onClick={() => onSelect(tf)}
            className={`rounded-[8px] px-3 py-1 uppercase tracking-[0.08em] transition ${
              isActive ? "bg-white text-black" : "text-white/60 hover:text-white"
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
  const width = 320;
  const height = 156;
  const step = width / (chartPoints.length - 1);
  const path = chartPoints
    .map((value, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${index * step} ${height - value}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-5">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[156px] w-full">
        <defs>
          <linearGradient id="line-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4B31F2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4B31F2" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${path} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#line-fill)"
          stroke="none"
        />
        <path
          d={path}
          stroke="#4B31F2"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-center">
      <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#848484]">
        {label}
      </p>
      <p className="mt-1 text-[18px] font-semibold tracking-[0.02em] text-white">{value}</p>
    </div>
  );
}

function SocialButton({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#111111] py-3 text-[15px] font-semibold tracking-[0.02em] text-white transition hover:border-white/40"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#1B1B1D]">
        {icon}
      </span>
      {label}
    </button>
  );
}

function CopyTradeCard({
  active,
  onToggle,
  onWatchingToggle,
  isWatching,
}: {
  active: boolean;
  onToggle: (nextValue: boolean) => void;
  onWatchingToggle: (nextValue: boolean) => void;
  isWatching: boolean;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-[#111111] px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[16px] font-semibold tracking-[0.02em] text-white">
            Copy trade
          </p>
          <p className="text-[13px] text-[#848484]">+15% (trailing) or -25%</p>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!active)}
          className={`rounded-full px-4 py-2 text-[14px] font-semibold tracking-[0.02em] ${
            active
              ? "bg-[#4B31F2] text-white"
              : "border border-white/20 text-white/70"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => onWatchingToggle(!isWatching)}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0C0C0C] px-4 py-3 text-left"
      >
        <Image
          src={isWatching ? "/icons/watching-active.png" : "/icons/watching-off.png"}
          alt={isWatching ? "Watching" : "Not watching"}
          width={20}
          height={20}
          className="h-5 w-5"
        />
        <div>
          <p className="text-[15px] font-semibold text-white">
            {isWatching ? "Following wallet" : "Follow wallet"}
          </p>
          <p className="text-[13px] text-[#848484]">
            {isWatching ? "Added to your Watching view" : "Tap to add to Watching"}
          </p>
        </div>
      </button>
    </div>
  );
}

function PositionRow({ position }: { position: Position }) {
  const changeLabel =
    position.change === 0
      ? position.amountLabel
      : `${position.change > 0 ? "+" : ""}${position.change.toFixed(2)}%`;
  const changeColor =
    position.change > 0 ? "text-emerald-400" : position.change < 0 ? "text-rose-400" : "text-white";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F1F21] text-[15px] font-semibold text-white">
          {position.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-white">{position.name}</p>
          <p className="text-[13px] text-[#848484]">{position.meta}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-[15px] font-semibold ${changeColor}`}>{changeLabel}</p>
        <p className="text-[13px] text-[#848484]">
          {position.rightSecondary ?? position.amountLabel}
        </p>
      </div>
    </div>
  );
}

function CaretIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 text-white transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 10l4 4 4-4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
      <path d="M17 3h3l-7 8.5L21.5 21H14l-4.5-6L4 21H1l7.5-9.5L2.5 3H10l4 5.5z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
      <path d="M9.5 16.2l-.4 4c.6 0 .8-.3 1.1-.6l2.6-2.5 5.4 3.9c1 .5 1.6.3 1.8-.9l3.2-15c.3-1.3-.5-1.8-1.5-1.5L1.4 9.5C.2 10 .2 10.8 1.2 11.1l5.7 1.8 13.2-8.3c.6-.4 1.1-.2.7.3z" />
    </svg>
  );
}

function getBalanceParts(value: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatted = formatter.format(value);
  const [intPart, frac = "00"] = formatted.split(".");
  return { int: intPart, frac };
}
