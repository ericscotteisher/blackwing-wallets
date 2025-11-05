"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import {
  actionMinScale,
  actionRevealOffsetPx,
  actionRevealWindowPx,
  actionToneClasses,
  type WalletSwipeAction,
} from "../constants";

type WalletRowActionButtonProps = {
  action: WalletSwipeAction;
  index: number;
  total: number;
  dragDistance: MotionValue<number>;
  onPress: () => void;
};

export function WalletRowActionButton({
  action,
  index,
  total,
  dragDistance,
  onPress,
}: WalletRowActionButtonProps) {
  const stepIndex = total - 1 - index;
  const revealStart = actionRevealOffsetPx * (stepIndex + 1);
  const revealEnd = revealStart + actionRevealWindowPx;

  const scale = useTransform(dragDistance, (distance) => {
    if (distance <= revealStart) return actionMinScale;
    if (distance >= revealEnd) return 1;
    const progress = (distance - revealStart) / (revealEnd - revealStart);
    return actionMinScale + progress * (1 - actionMinScale);
  });

  const opacity = useTransform(dragDistance, (distance) => {
    if (distance <= revealStart) return 0;
    if (distance >= revealEnd) return 1;
    return (distance - revealStart) / (revealEnd - revealStart);
  });

  return (
    <motion.button
      type="button"
      onClick={onPress}
      style={{ scale, opacity }}
      className={`flex items-center justify-center whitespace-nowrap rounded-full p-2 text-[13px] font-semibold tracking-[0.02em] transition-colors duration-200 ${actionToneClasses[action.tone]}`}
    >
      {action.label}
    </motion.button>
  );
}
