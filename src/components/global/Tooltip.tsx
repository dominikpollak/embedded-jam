import type { ReactNode } from "react";

import React, { useLayoutEffect, useRef, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  delay?: number;
  forceDirection?: "top" | "bottom" | "left" | "right";
  hide?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  delay,
  forceDirection,
  hide = false,
}) => {
  let timeout: any;
  const [visible, setVisible] = useState<boolean>(false);
  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right"
  >(forceDirection || "top");

  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipItemRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (hide) return;
    clearTimeout(timeout);
    setVisible(true);
  };

  const hideTooltip = () => {
    timeout = setTimeout(() => {
      setVisible(false);
    }, delay || 100);
  };

  useLayoutEffect(() => {
    if (
      !visible ||
      !tooltipRef.current ||
      !tooltipItemRef.current ||
      forceDirection
    )
      return;

    const tooltipItemRect = tooltipItemRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const spaceLeft = tooltipRect.left;
    const spaceRight = viewportWidth - tooltipRect.right;
    const spaceTop = tooltipRect.top;
    const spaceBottom = viewportHeight - tooltipRect.bottom;

    if (
      spaceTop >= tooltipItemRect.height &&
      !(spaceRight < tooltipItemRect.width) &&
      !(spaceLeft < tooltipItemRect.width)
    ) {
      setDirection("top");
    } else if (
      spaceRight < tooltipItemRect.width &&
      spaceLeft >= tooltipItemRect.width
    ) {
      setDirection("left");
    } else if (
      spaceLeft < tooltipItemRect.width &&
      spaceRight >= tooltipItemRect.width
    ) {
      setDirection("right");
    } else if (
      spaceTop < tooltipItemRect.height &&
      spaceBottom >= tooltipItemRect.height &&
      !(spaceRight < tooltipItemRect.width) &&
      spaceLeft >= tooltipItemRect.width
    ) {
      setDirection("bottom");
    }
  }, [visible]);

  return (
    <div
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onTouchStart={showTooltip}
      onTouchEnd={hideTooltip}
      className="relative z-10 inline-block"
      ref={tooltipRef}
    >
      {children}
      {visible && (
        <div
          ref={tooltipItemRef}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          className={`
            absolute z-50 transform rounded-xl border border-border bg-background px-4 py-2 text-sm
            ${direction === "top" && "bottom-0 left-1/2 mb-6 -translate-x-1/2"}
            ${
              direction === "right" && "left-full top-1/2 ml-4 -translate-y-1/2"
            }
            ${direction === "bottom" && "left-1/2 top-0 mt-6 -translate-x-1/2"}
            ${
              direction === "left" && "right-full top-1/2 mr-4 -translate-y-1/2"
            }
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};
