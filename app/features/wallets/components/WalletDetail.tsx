"use client";

import type { WalletView } from "../constants";
import { baseTextClass } from "../constants";

type WalletDetailProps = {
  wallet: WalletView;
  onWatchingChange: (nextValue: boolean) => void;
  onAutoTradeChange: (nextValue: boolean) => void;
};

export function WalletDetail({
  wallet,
  onWatchingChange,
  onAutoTradeChange,
}: WalletDetailProps) {
  return (
    <div className="space-y-6 py-8">
      <div className="rounded-2xl border border-white/10 bg-[#111111] px-6 py-5">
        <span className="text-[13px] uppercase tracking-[0.2em] text-[#A1A1A1]">
          Wallet
        </span>
        <p className="mt-2 text-[28px] font-semibold tracking-[0.02em] text-white">
          {wallet.name}
        </p>
        <p className={`${baseTextClass} text-[#A1A1A1]`}>
          Current tier: {wallet.status}
        </p>
      </div>

      <div className="space-y-4">
        <DetailToggle
          label="Watching"
          description="Show this wallet in your Watching stack."
          active={wallet.isWatching}
          onChange={onWatchingChange}
        />
        <DetailToggle
          label="Auto-trade"
          description="Mirror trades automatically when enabled."
          active={wallet.isAutoTrade}
          onChange={onAutoTradeChange}
        />
      </div>
    </div>
  );
}

type DetailToggleProps = {
  label: string;
  description: string;
  active: boolean;
  onChange: (nextValue: boolean) => void;
};

function DetailToggle({ label, description, active, onChange }: DetailToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-5 py-4">
      <div className="flex flex-col">
        <span className="text-[17px] font-semibold tracking-[0.02em] text-white">
          {label}
        </span>
        <span className={`${baseTextClass} text-[#A1A1A1]`}>
          {description}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onChange(!active)}
        aria-pressed={active}
        className="relative inline-flex h-8 w-14 items-center rounded-full bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
      >
        <span
          className={`absolute inset-0 rounded-full transition ${
            active ? "bg-white" : "bg-white/20"
          }`}
        />
        <span
          className={`relative ml-[4px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0C0C0C] text-xs font-semibold text-white transition-transform ${
            active ? "translate-x-[24px]" : "translate-x-0"
          }`}
        >
          {active ? "on" : "off"}
        </span>
        <span className="sr-only">{`Toggle ${label}`}</span>
      </button>
    </div>
  );
}
