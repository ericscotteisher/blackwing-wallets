"use client";

export type BottomTabId = "Wallets" | "Discover" | "Sugar";

type BottomTab = {
  id: BottomTabId;
  icon: (props: { active: boolean }) => JSX.Element;
  ariaLabel: string;
};

const bottomTabs: BottomTab[] = [
  { id: "Wallets", icon: DiscoverIcon, ariaLabel: "Wallets" },
  { id: "Discover", icon: DaddyIcon, ariaLabel: "Discover" },
  { id: "Sugar", icon: SugarIcon, ariaLabel: "Sugar" },
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
              className="flex items-center justify-center"
              aria-label={tab.ariaLabel}
            >
              <tab.icon active={isActive} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function DaddyIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="39"
      height="35"
      viewBox="0 0 39 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={active ? "opacity-100" : "opacity-40"}
    >
      <path
        d="M29 11.25C29 12.9069 27.6569 14.25 26 14.25C24.3431 14.25 23 12.9069 23 11.25"
        stroke="white"
        strokeWidth="2"
      />
      <path
        opacity="0.5"
        d="M29 11.25C29 9.59315 27.6569 8.25 26 8.25C24.3431 8.25 23 9.59315 23 11.25"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M16 11.25C16 12.9069 14.6569 14.25 13 14.25C11.3431 14.25 10 12.9069 10 11.25"
        stroke="white"
        strokeWidth="2"
      />
      <path
        opacity="0.5"
        d="M16 11.25C16 9.59315 14.6569 8.25 13 8.25C11.3431 8.25 10 9.59315 10 11.25"
        stroke="white"
        strokeWidth="2"
      />
      <rect
        x="10"
        y="20.25"
        width="19"
        height="6"
        rx="3"
        stroke="white"
        strokeWidth="2"
      />
      <path
        opacity="0.5"
        d="M23 19.25V23.25"
        stroke="white"
        strokeWidth="5"
      />
      <path
        opacity="0.5"
        d="M16 19.25V23.25"
        stroke="white"
        strokeWidth="5"
      />
    </svg>
  );
}

function DiscoverIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={active ? "opacity-100" : "opacity-40"}
    >
      <path
        d="M4.94531 25H27.1675V21.6667H21.612V13.8889H27.1675V9.44444H4.94531V25Z"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="25.4987" cy="17.7778" r="1.66667" fill="white" />
      <mask id="discoverMask" maskUnits="userSpaceOnUse" x="3" y="3" width="22" height="9" maskType="alpha">
        <rect x="3.83203" y="3.88889" width="21.1111" height="7.77778" fill="#D9D9D9" />
      </mask>
      <g mask="url(#discoverMask)">
        <path
          d="M22.7209 9.44444V7.80579C22.7209 6.37279 21.3846 5.31442 19.9897 5.64263L3.83203 9.44444"
          stroke="white"
          strokeWidth="2.22222"
        />
      </g>
    </svg>
  );
}

function SugarIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={active ? "opacity-100" : "opacity-40"}
    >
      <path d="M26 24H6" stroke="white" strokeWidth="2" />
      <rect x="21" y="12" width="3" height="3" fill="white" />
      <rect x="12" y="10" width="3" height="3" fill="white" />
      <rect x="18" y="6" width="3" height="3" fill="white" />
      <path d="M6 17L26 20" stroke="white" strokeWidth="2" />
    </svg>
  );
}
