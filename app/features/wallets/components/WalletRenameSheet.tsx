"use client";

import { useState } from "react";

type WalletRenameSheetProps = {
  open: boolean;
  walletName: string;
  addressLabel: string;
  currentAlias?: string;
  onClose: () => void;
  onSave: (alias: string | null) => void;
};

type Option = "custom" | "address";

export function WalletRenameSheet({
  open,
  walletName,
  addressLabel,
  currentAlias,
  onClose,
  onSave,
}: WalletRenameSheetProps) {
  const [option, setOption] = useState<Option>(currentAlias ? "custom" : "address");
  const [inputValue, setInputValue] = useState(currentAlias ?? "");

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (option === "address") {
      onSave(addressLabel);
    } else {
      onSave(inputValue.trim() || null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close rename" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[420px] rounded-[28px] border border-white/10 bg-[#0F0F10] p-6"
      >
        <h2 className="text-[20px] font-medium tracking-[0.02em] text-white">Add a nickname</h2>
        <p className="mt-2 text-[16px] font-medium text-[#848484]">
          You can add a nickname to help you remember wtf this is.
        </p>

        <div className="mt-6 space-y-4">
          <label
            className={`flex items-center gap-3 rounded-[14px] border px-4 py-3 ${
              option === "custom" ? "border-white/40 bg-white/5" : "border-white/10"
            }`}
          >
            <input
              type="radio"
              className="accent-[#4B31F2]"
              checked={option === "custom"}
              onChange={() => setOption("custom")}
            />
            <input
              type="text"
              placeholder={`Nickname for @${walletName}`}
              value={inputValue}
              onFocus={() => setOption("custom")}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent text-[16px] font-medium text-white placeholder:text-[#5C5C63] focus:outline-none"
            />
          </label>

          <label
            className={`flex items-center justify-between rounded-[14px] border px-4 py-3 text-[16px] ${
              option === "address" ? "border-white/40 bg-white/5 text-white" : "border-white/10 text-[#848484]"
            }`}
          >
            <span>{addressLabel}</span>
            <input
              type="radio"
              className="accent-[#4B31F2]"
              checked={option === "address"}
              onChange={() => setOption("address")}
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 h-12 w-full rounded-[12px] bg-[#4B31F2] text-[16px] font-semibold text-white transition hover:bg-[#442FDB] disabled:opacity-40"
          disabled={option === "custom" && inputValue.trim().length === 0}
        >
          Save
        </button>
      </form>
    </div>
  );
}
