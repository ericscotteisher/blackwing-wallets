"use client";

import type { ReactNode } from "react";

import { baseTextClass } from "../constants";

export type BottomTabId = "Wallets" | "Home" | "Sugar";

type BottomTab = {
  id: BottomTabId;
  label: string;
  icon: (props: { active: boolean }) => ReactNode;
};

const bottomTabs: BottomTab[] = [
  { id: "Wallets", label: "Wallets", icon: WalletTabIcon },
  { id: "Home", label: "Home", icon: HomeTabIcon },
  { id: "Sugar", label: "Sugar", icon: SugarTabIcon },
];

type BottomTabsProps = {
  activeTab: BottomTabId;
  onChange: (tab: BottomTabId) => void;
};

export function BottomTabs({ activeTab, onChange }: BottomTabsProps) {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#0C0C0C]/95 backdrop-blur">
      <div className="flex h-16 items-center justify-around px-8">
        {bottomTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="flex flex-col items-center gap-1"
            >
              <tab.icon active={isActive} />
              <span
                className={`${baseTextClass} ${
                  isActive ? "text-white" : "text-[#A1A1A1]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function WalletTabIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-violet-400" : "text-zinc-500"}`}
      fill="currentColor"
    >
      <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25zm2.75-.25a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75v-2.25h-3a2.75 2.75 0 0 1-2.75-2.75A2.75 2.75 0 0 1 14.25 9h3V7.25a.75.75 0 0 0-.75-.75zM17.25 10.5h-3a1.25 1.25 0 1 0 0 2.5h3z" />
    </svg>
  );
}

function HomeTabIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-zinc-100" : "text-zinc-500"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5.5 10v9h5v-5h3v5h5v-9" />
    </svg>
  );
}

function SugarTabIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-pink-400" : "text-zinc-500"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4c1.7-2.667 6-2.667 7.7 0 1.7 2.667.75 6.4-3.7 9.2l-4 2.5-4-2.5C3.55 10.4 2.6 6.667 4.3 4 6 1.333 10.3 1.333 12 4z" />
      <path d="M7 13l5 7 5-7" />
    </svg>
  );
}
