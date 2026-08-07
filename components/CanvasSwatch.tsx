import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import styles from "./CanvasSwatch.module.css";

export type CanvasSwatchProps = {
  /** The fill. A fabric tone from the catalogue, or a token. */
  color?: string;
  height?: number | string;
  radius?: string;
  /** Mono label along the bottom naming the garment — "CARDIGAN". */
  label?: string;
  /**
   * Pointillist dab texture. Turn 3 keeps this for brand and look swatches
   * but takes it off product placeholders, which are now tinted to the
   * actual cloth rather than being decorative fields.
   */
  texture?: boolean;
  /** The gauzy multi-pigment wash. Welcome and milestones only. */
  wash?: boolean;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "color" | "children">;

const len = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

/**
 * CanvasSwatch — the painted field standing in for photography.
 */
export default function CanvasSwatch({
  color = "var(--fabric-neutral)",
  height = 240,
  radius = "var(--radius-xl)",
  label,
  texture = false,
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
          ...style,
        } as CSSProperties
      }
    >
      {texture && <div className={styles.pointillism} />}
      {wash && <div className={styles.wash} />}
      {label && (
        <div
          className={[
            styles.label,
            typeof height === "number" && height >= 160 && styles.labelLarge,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
