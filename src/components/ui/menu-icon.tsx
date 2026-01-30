import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const MenuIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".menu-line-top",
        { y: -1.5, width: 18 },
        { duration: 0.25, ease: "easeOut" },
      );
      animate(
        ".menu-line-mid",
        { scaleX: 0.75, opacity: 0.7 },
        { duration: 0.25, ease: "easeOut" },
      );
      animate(
        ".menu-line-bot",
        { y: 1.5, width: 14 },
        { duration: 0.25, ease: "easeOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".menu-line-top",
        { y: 0, width: 18 },
        { duration: 0.2, ease: "easeInOut" },
      );
      animate(
        ".menu-line-mid",
        { scaleX: 1, opacity: 1 },
        { duration: 0.2, ease: "easeInOut" },
      );
      animate(
        ".menu-line-bot",
        { y: 0, width: 18 },
        { duration: 0.2, ease: "easeInOut" },
      );
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        onHoverStart={start}
        onHoverEnd={stop}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
      >
        <motion.line
          className="menu-line-top"
          x1="3" y1="7" x2="21" y2="7"
          style={{ transformOrigin: "3px 7px", width: 18 }}
        />
        <motion.line
          className="menu-line-mid"
          x1="3" y1="12" x2="21" y2="12"
          style={{ transformOrigin: "12px 12px" }}
        />
        <motion.line
          className="menu-line-bot"
          x1="3" y1="17" x2="21" y2="17"
          style={{ transformOrigin: "3px 17px", width: 18 }}
        />
      </motion.svg>
    );
  },
);

MenuIcon.displayName = "MenuIcon";
export default MenuIcon;
