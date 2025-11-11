"use client";

import { useState } from "react";

const ranges = ["1d", "7d", "30d"] as const;
type Range = (typeof ranges)[number];

type WalletStatsSheetProps = {
  open: boolean;
  walletName: string;
  timeframe: Range;
  onClose: () => void;
};

const baseStats = {
  open: 3,
  closed: 4,
  winners: 2,
  losers: 4,
  avgProfit: "+32.07%",
  bestTrade: "+120.3%",
  worstTrade: "-24.1%",
};

export function WalletStatsSheet({ open, walletName, timeframe, onClose }: WalletStatsSheetProps) {
  const [range, setRange] = useState<Range>(timeframe);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-8">
      <button type="button" className="absolute inset-0" aria-label="Close stats" onClick={onClose} />
      <div className="relative w-full max-w-[520px] rounded-[28px] border border-white/10 bg-[#0E0E0F] p-6 shadow-2xl">
        <div className="text-[15px] font-medium text-[#848484]">@{walletName}</div>
        <div className="mt-2 flex items-center justify-between">
          <h2 className="text-[24px] font-semibold tracking-[0.02em] text-white">Performance</h2>
          <div className="flex gap-1 rounded-[10px] bg-white/5 p-1 text-[13px] uppercase tracking-[0.1em]">
            {ranges.map((item) => {
              const isActive = item === range;
              return (
                <button
                  key={item}
                  type="button"
                  className={`rounded-[8px] px-3 py-1 ${isActive ? "bg-white text-black" : "text-white/70"}`}
                  onClick={() => setRange(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 rounded-[18px] border border-white/10 bg-[#141417] px-4 py-5 text-center text-[15px] text-white">
          <div>
            <p className="text-[#848484]">Open trades</p>
            <p className="text-[22px] font-semibold">{baseStats.open}</p>
          </div>
          <div>
            <p className="text-[#848484]">Closed trades</p>
            <p className="text-[22px] font-semibold">{baseStats.closed}</p>
          </div>
          <div>
            <p className="text-[#848484]">Winners</p>
            <p className="text-[22px] font-semibold">{baseStats.winners}</p>
          </div>
          <div>
            <p className="text-[#848484]">Losers</p>
            <p className="text-[22px] font-semibold">{baseStats.losers}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-[15px]">
          <Stat label="Avg. profit" value={baseStats.avgProfit} />
          <Stat label="Best trade" value={baseStats.bestTrade} />
          <Stat label="Worst trade" value={baseStats.worstTrade} />
          <Stat label="Volume" value="$1.2M" />
          <Stat label="Avg. hold" value="3d 4h" />
          <Stat label="Hit rate" value="65%" />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 h-12 w-full rounded-[12px] bg-[#222222] text-[16px] font-semibold text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-white">
      <span className="text-[#848484]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
