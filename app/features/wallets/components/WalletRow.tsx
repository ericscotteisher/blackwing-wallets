"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import type { AnimationPlaybackControls, PanInfo } from "motion";

import {
  baseTextClass,
  walletSwipeActions,
  type TradeListEntry,
  type WalletSectionId,
  type WalletSwipeAction,
  type Timeframe,
  type WalletView,
} from "../constants";
import {
  getBadgeClasses,
  getMoneyParts,
  getPercentDisplay,
  getTokenBadgeClasses,
  getTradeSummary,
} from "../utils";
import { AnimatedList } from "./AnimatedList";
import { WalletRowActionButton } from "./WalletRowActionButton";

type WalletRowProps = {
  sectionId: WalletSectionId;
  wallet: WalletView;
  expanded: boolean;
  timeframe: Timeframe;
  onToggle: () => void;
  onSelect: () => void;
};

export function WalletRow({
  sectionId,
  wallet,
  expanded,
  timeframe,
  onToggle,
  onSelect,
}: WalletRowProps) {
  const actions = walletSwipeActions[sectionId] ?? [];
  const badgeClasses = getBadgeClasses(wallet.name);
  const summary = getTradeSummary(wallet.trades, timeframe);
  const walletMoney = getMoneyParts(wallet.pnl[timeframe].money);
  const walletPercent = getPercentDisplay(wallet.pnl[timeframe].percent);
  const showDiscoverStatus =
    sectionId === "discover" && (wallet.isAutoTrade || wallet.isWatching);
  const showWatchingAutoIcon = sectionId === "watching" && wallet.isAutoTrade;
  const indicatorIcon = wallet.isAutoTrade
    ? {
        src: "/wallet-icons/daddy-watching.png",
        alt: "Auto trade active",
        width: 22,
        height: 20,
        className: "h-[20px] w-[22px]",
      }
    : {
        src: "/icons/watching-active.png",
        alt: "Watching active",
        width: 20,
        height: 20,
        className: "h-5 w-5",
      };
  const tradeEntries = useMemo(() => {
    const entries: TradeListEntry[] = [];
    if (summary) {
      entries.push({
        kind: "summary",
        id: `${wallet.id}-summary`,
        summary,
      });
    }
    wallet.trades.forEach((trade, index) => {
      entries.push({
        kind: "trade",
        id: `${wallet.id}-${trade.id}-${index}`,
        trade,
      });
    });
    return entries;
  }, [summary, wallet.id, wallet.trades]);
  const hasTradeEntries = tradeEntries.length > 0;
  const x = useMotionValue(0);
  const dragDistance = useTransform(x, (value) => Math.max(0, -value));
  const actionsContainerRef = useRef<HTMLDivElement | null>(null);
  const actionsWidthRef = useRef(0);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const isDraggingRef = useRef(false);
  const [actionsWidth, setActionsWidth] = useState(0);
  const isOpenRef = useRef(false);

  const animateTo = useCallback(
    (target: number) => {
      animationRef.current?.stop();
      animationRef.current = animate(x, target, {
        type: "spring",
        bounce: 0,
        duration: 0.28,
      });
    },
    [x],
  );

  const openRow = useCallback(() => {
    if (!actionsWidthRef.current) return;
    isOpenRef.current = true;
    animateTo(-actionsWidthRef.current);
  }, [animateTo]);

  const closeRow = useCallback(() => {
    if (!isOpenRef.current && x.get() === 0) {
      return;
    }
    isOpenRef.current = false;
    animateTo(0);
  }, [animateTo, x]);

  useLayoutEffect(() => {
    const node = actionsContainerRef.current;
    if (!node) return;

    const updateWidth = () => {
      const width = actions.length === 0 ? 0 : node.offsetWidth;
      if (actionsWidthRef.current === width) return;
      actionsWidthRef.current = width;
      setActionsWidth(width);
    };

    updateWidth();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [actions.length]);

  useEffect(() => {
    if (!isOpenRef.current && x.get() === 0) {
      return;
    }
    animationRef.current?.stop();
    x.set(0);
    isOpenRef.current = false;
  }, [sectionId, x]);

  useEffect(() => {
    if (!isOpenRef.current) return;

    if (!actionsWidth) {
      isOpenRef.current = false;
      x.set(0);
      return;
    }

    animationRef.current?.stop();
    x.set(-actionsWidth);
  }, [actionsWidth, x]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    animationRef.current?.stop();
  };

  const finishDrag = () => {
    requestAnimationFrame(() => {
      isDraggingRef.current = false;
    });
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!actionsWidthRef.current) {
      closeRow();
      finishDrag();
      return;
    }

    const currentX = x.get();
    const projected = currentX + info.velocity.x * 0.2;
    const threshold = -actionsWidthRef.current * 0.35;

    if (projected < threshold) {
      openRow();
    } else {
      closeRow();
    }

    finishDrag();
  };

  const handleToggleClick = () => {
    if (isDraggingRef.current) return;
    if (isOpenRef.current) {
      closeRow();
    }
    onToggle();
  };

  const handleSelectClick = () => {
    if (isDraggingRef.current) return;
    if (isOpenRef.current) {
      closeRow();
    }
    onSelect();
  };

  const handleActionClick = (action: WalletSwipeAction) => {
    closeRow();
    if (process.env.NODE_ENV !== "production") {
      console.info(`[wallet-actions] ${action.id} on ${wallet.id}`);
    }
  };

  const dragConstraints =
    actions.length > 0
      ? { left: -actionsWidth, right: 0 }
      : { left: 0, right: 0 };

  return (
    <div>
      <div className="relative overflow-hidden bg-[#0C0C0C]">
        <div
          ref={actionsContainerRef}
          className="absolute inset-y-0 right-0 z-0 flex items-center gap-2 px-3 bg-[#0C0C0C]"
        >
          {actions.map((action, index) => (
            <WalletRowActionButton
              key={action.id}
              action={action}
              index={index}
              total={actions.length}
              dragDistance={dragDistance}
              onPress={() => handleActionClick(action)}
            />
          ))}
        </div>
        <motion.div
          drag={actions.length > 0 ? "x" : false}
          dragConstraints={dragConstraints}
          dragElastic={{ left: 0.04, right: 0.2 }}
          dragMomentum={false}
          dragDirectionLock
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="group relative z-10 flex items-center gap-0 bg-[#0C0C0C] transition-colors duration-200 active:bg-[#181818]"
        >
          <button
            type="button"
            onClick={handleToggleClick}
            className="flex h-10 w-8 shrink-0 items-center justify-left text-white transition"
            aria-label={expanded ? "Hide trades" : "Show trades"}
          >
            <ChevronIndicator direction={expanded ? "down" : "right"} />
          </button>

          <button
            type="button"
            onClick={handleSelectClick}
            className="flex flex-1 items-center justify-between rounded-2xl py-4 text-left transition focus-visible:outline-none"
            aria-label={`Open ${wallet.name}`}
          >
            <div className="flex items-center gap-2">
              {showDiscoverStatus || showWatchingAutoIcon ? (
                <Image
                  src={indicatorIcon.src}
                  alt={indicatorIcon.alt}
                  width={indicatorIcon.width}
                  height={indicatorIcon.height}
                  className={indicatorIcon.className}
                />
              ) : null}
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-[5px] text-[13px] font-semibold text-white ${badgeClasses}`}
              >
                <span className="translate-y-[-1px]">@</span>
              </span>
              <span className={`${baseTextClass} text-white`}>
                {wallet.name}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`${baseTextClass} text-white`}>
                <span className="text-[#A1A1A1]">{walletMoney.sign}</span>
                {walletMoney.amount}
              </span>
              <span className={`${baseTextClass} text-[#A1A1A1]`}>
                {walletPercent}
              </span>
            </div>
          </button>
        </motion.div>
      </div>

      {hasTradeEntries && (
        <div className="pl-8">
          <AnimatedList
            items={tradeEntries}
            expanded={expanded}
            className="mt-2 space-y-0"
            getKey={(entry) => entry.id}
            renderItem={(entry) => {
              if (entry.kind === "summary") {
                return (
                  <div className="mb-2 flex items-center gap-3 rounded-full bg-[#1E2025] px-4 py-2 text-[14px] font-medium text-[#848484]">
                    <span className="flex-1 text-left">
                      {entry.summary.tradesLabel}
                    </span>
                    <span className="flex-1 text-center">
                      {entry.summary.winRateLabel}
                    </span>
                    <span className="flex-1 text-right">
                      See stats
                    </span>
                  </div>
                );
              }
              const trade = entry.trade;
              const tradeMoney = getMoneyParts(trade.pnl[timeframe].money);
              const tradePercent = getPercentDisplay(trade.pnl[timeframe].percent);
              return (
                <div className="group flex items-center justify-between py-4 transition-colors duration-200 active:bg-[#181818]/80">
                  <div className="flex items-center gap-3">
                    {trade.image ? (
                      <div className="h-5 w-5 overflow-hidden rounded-[5px]">
                        <Image
                          src={trade.image}
                          alt={trade.name}
                          width={20}
                          height={20}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-[5px] text-[15px] font-semibold text-white ${getTokenBadgeClasses(trade.name)}`}
                      >
                        {trade.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className={`${baseTextClass} text-white`}>
                      {trade.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${baseTextClass} text-white`}>
                      <span className="text-[#A1A1A1]">{tradeMoney.sign}</span>
                      {tradeMoney.amount}
                    </span>
                    <span className={`${baseTextClass} text-[#A1A1A1]`}>
                      {tradePercent}
                    </span>
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

function ChevronIndicator({ direction }: { direction: "right" | "down" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[16px] w-[16px] transform text-white transition-transform duration-200 ${
        direction === "down" ? "rotate-90" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 5l8 7-8 7" />
    </svg>
  );
}
