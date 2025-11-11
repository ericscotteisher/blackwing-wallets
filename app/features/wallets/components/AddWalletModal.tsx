"use client";

import { useState } from "react";

type AddWalletModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (address: string) => void;
};

export function AddWalletModal({ open, onClose, onSubmit }: AddWalletModalProps) {
  const [address, setAddress] = useState("");

  const handleClose = () => {
    setAddress("");
    onClose();
  };

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = address.trim();
    if (!value) return;
    onSubmit(value);
    setAddress("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 h-full w-full"
        aria-label="Close add wallet modal"
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[420px] rounded-[28px] border border-white/10 bg-[#0E0E0F] p-6 shadow-lg shadow-black/50"
      >
        <h2 className="text-[20px] font-medium tracking-[0.02em] text-white">
          Enter wallet address
        </h2>
        <p className="mt-2 text-[16px] font-medium text-[#848484]">
          See trade history and choose to follow or copy their trades
        </p>
        <label className="mt-6 block text-[14px] font-medium text-[#848484]">
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Add a wallet"
            className="mt-2 w-full rounded-[12px] border border-[#1E2025] bg-transparent px-4 py-3 text-[16px] font-medium text-white placeholder:text-[#5C5C63] focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </label>
        <button
          type="submit"
          className="mt-6 h-12 w-full rounded-[12px] bg-[#4B31F2] text-[16px] font-semibold text-white transition hover:bg-[#452DDB] disabled:opacity-40"
          disabled={!address.trim()}
        >
          See wallet
        </button>
      </form>
    </div>
  );
}
