"use client";

import { useEffect, useState, type ReactNode } from "react";

type AnimatedListProps<T> = {
  items: T[];
  expanded: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  className?: string;
  enterTotal?: number;
  exitTotal?: number;
};

export function AnimatedList<T>({
  items,
  expanded,
  renderItem,
  getKey,
  className,
  enterTotal = 200,
  exitTotal = 220,
}: AnimatedListProps<T>) {
  const count = items.length;
  const enterStep = count > 0 ? enterTotal / count : enterTotal;
  const exitStep = count > 0 ? exitTotal / count : exitTotal;
  const [shouldRender, setShouldRender] = useState(expanded && count > 0);
  const [phase, setPhase] = useState<"enter" | "exit">(
    expanded && count > 0 ? "enter" : "exit",
  );

  useEffect(() => {
    let timeout: number | null = null;
    const frames: number[] = [];

    if (count === 0) {
      frames.push(
        window.requestAnimationFrame(() => {
          setShouldRender(false);
          setPhase("exit");
        }),
      );
    } else if (expanded) {
      frames.push(
        window.requestAnimationFrame(() => {
          setShouldRender(true);
          setPhase("exit");
          frames.push(
            window.requestAnimationFrame(() => {
              setPhase("enter");
            }),
          );
        }),
      );
    } else {
      frames.push(
        window.requestAnimationFrame(() => {
          setPhase("exit");
        }),
      );
      const totalTime = exitStep * Math.max(count, 1) + 2;
      timeout = window.setTimeout(() => setShouldRender(false), totalTime);
    }

    return () => {
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }
      frames.forEach((id) => window.cancelAnimationFrame(id));
    };
  }, [expanded, count, exitStep]);

  if (!shouldRender) {
    return null;
  }

  const containerClass = className ? `flex flex-col ${className}` : "flex flex-col";

  return (
    <div className={containerClass}>
      {items.map((item, index) => {
        const key = getKey(item, index);
        const isEntering = phase === "enter";
        const duration = phase === "exit" ? exitStep : enterStep;
        const delay =
          phase === "exit"
            ? (count - 1 - index) * exitStep
            : index * enterStep;
        return (
          <div
            key={key}
            style={{
              transitionProperty: "opacity, transform",
              transitionDuration: `${duration}ms`,
              transitionDelay: `${delay}ms`,
              opacity: isEntering ? 1 : 0,
              transform: isEntering ? "translateY(0px)" : "translateY(-6px)",
            }}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
}
