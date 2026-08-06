import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import styles from "./CanvasSwatch.module.css";

export type CanvasSwatchProps = {
  /** Pigment fill. Pass a token, e.g. `var(--tint-rose)`. */
  color?: string;
  /** Field height. A bare number is read as pixels. */
  height?: number | string;
  /** Corner radius. Product thumbs use `var(--radius-xl)`. */
  radius?: string;
  /** Optional centred mono eyebrow, set over the paint. */
  caption?: string;
  captionColor?: string;
  /** Layer the gauzy multi-pigment wash on top. Hero fields only. */
  wash?: boolean;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "color" | "children">;

const len = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

/**
 * CanvasSwatch — The Edit's signature painted colour field: a pigment
 * fill dressed with a pointillist dab texture and a brushstroke sheen.
 * Stands in for product photography, and turns any surface "painted".
 */
export default function CanvasSwatch({
  color = "var(--pig-cobalt)",
  height = 240,
  radius = "var(--radius-xl)",
  caption,
  captionColor = "var(--caption-on-paint)",
  wash = false,
  children,
  className,
  style,
  ...rest
}: CanvasSwatchProps) {
  return (
    <div
      {...rest}
      className={[styles.swatch, className].filter(Boolean).join(" ")}
      style={
        {
          "--swatch-color": color,
          "--swatch-height": len(height),
          "--swatch-radius": radius,
          "--swatch-caption-color": captionColor,
          ...style,
        } as CSSProperties
      }
    >
      <div className={styles.pointillism} />
      {wash && <div className={styles.wash} />}
      <div className={styles.sheen} />
      {caption && <div className={styles.caption}>{caption}</div>}
      {children}
    </div>
  );
}
