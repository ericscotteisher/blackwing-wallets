"use client";

type AddWalletModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AddWalletModal({ open, onClose }: AddWalletModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full"
        aria-label="Close add wallet modal"
      />
      <div className="relative z-10 w-[280px] rounded-3xl bg-[#121214] p-6 text-center shadow-lg shadow-black/50">
        <h2 className="text-[17px] font-semibold tracking-[0.02em] text-white">
          Add a wallet
        </h2>
        <p className="mt-2 text-[14px] tracking-[0.02em] text-[#A1A1A1]">
          Will build this later
        </p>
      </div>
    </div>
  );
}
