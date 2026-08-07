import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import styles from "./Avatar.module.css";

export type AvatarProps = {
  initials?: string;
  size?: number;
  /** Fill. The app header uses ink; pigments read as accents. */
  color?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "color">;

/**
 * Avatar — a round initials chip. Ink by default, as in the app
 * header; pass a pigment token when it should carry colour.
 */
export default function Avatar({
  initials = "AL",
  size = 26,
  color = "var(--ink-0)",
  className,
  style,
  ...rest
}: AvatarProps) {
  return (
    <div
      {...rest}
      className={[styles.avatar, className].filter(Boolean).join(" ")}
      style={
        {
          "--avatar-size": `${size}px`,
          "--avatar-color": color,
          "--avatar-font-size": `${Math.round(size * 0.34 * 10) / 10}px`,
          ...style,
        } as CSSProperties
      }
    >
      {initials}
    </div>
  );
}
