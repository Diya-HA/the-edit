import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { IMAGE_WIDTH } from "@/lib/images";
import ProductImage from "./ProductImage";
import styles from "./CanvasSwatch.module.css";

export type CanvasSwatchProps = {
  /** The fill. A fabric tone from the catalogue, or a token. */
  color?: string;
  height?: number | string;
  /** Shape, as a CSS ratio — "1 / 1", "4 / 5". Wins over height when set. */
  aspect?: string;
  radius?: string;
  /** Mono label along the bottom naming the garment — "CARDIGAN". */
  label?: string;
  /**
   * The brand's photograph. When set it fills the field and the colour
   * becomes what shows underneath it while it loads — so the grid never
   * flashes white and never shifts.
   */
  image?: string | null;
  /** Describes the garment for anyone who can't see it. */
  alt?: string;
  /**
   * The photograph's own measured background. When present it paints the
   * field instead of the fabric tone, so the picture and the card meet with
   * no visible seam — which is what lets five brands shooting on five
   * slightly different whites read as one edit. Falls back to the tone.
   */
  ground?: string | null;
  /** Which width to ask the brand's CDN for. Cards by default. */
  imageWidth?: number;
  /**
   * Load this one eagerly. For the piece a screen is about — the detail hero —
   * which is the largest thing on it and the last to arrive if left to lazy
   * loading. Everything in a feed should stay lazy.
   */
  priority?: boolean;
  /**
   * Pointillist dab texture. Turn 3 keeps this for brand and look swatches
   * but takes it off product placeholders, which are now tinted to the
   * actual cloth rather than being decorative fields. Over a photograph it
   * comes back automatically, at a fraction of the strength — the design
   * system's rule is that photography replaces the fill and the texture
   * stays as an overlay.
   */
  texture?: boolean;
  /** The gauzy multi-pigment wash. Welcome and milestones only. */
  wash?: boolean;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "color" | "children">;

const len = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

/**
 * CanvasSwatch — the painted field, and the frame photography sits in.
 */
export default function CanvasSwatch({
  color = "var(--fabric-neutral)",
  height,
  aspect,
  radius = "var(--radius-xl)",
  label,
  image,
  alt,
  ground,
  imageWidth = IMAGE_WIDTH.card,
  priority = false,
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
      className={[styles.swatch, image && !ground && styles.hasPhoto, className]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          /* The photograph's own ground when it was measured, the fabric
             tone when it was not. Either way the field is painted before
             the image arrives, so nothing flashes white. */
          "--swatch-color": ground ?? color,
          "--swatch-height": height === undefined ? "auto" : len(height),
          "--swatch-aspect": aspect ?? "auto",
          "--swatch-radius": radius,
          ...style,
        } as CSSProperties
      }
    >
      {/* Cropped, never letterboxed, and centred — brand packshots put the
          garment in the middle of the frame, so the middle is what survives a
          4:5 crop of a 1:1 source. Falls back to the field and the garment
          noun if the brand's CDN no longer has it. */}
      {image && (
        <ProductImage
          src={image}
          alt={alt ?? ""}
          width={imageWidth}
          priority={priority}
          label={label}
          labelLarge={typeof height === "number" && height >= 160}
        />
      )}

      {/* Over photography the stipple is an accent, not the subject. */}
      {(texture || image) && (
        <div
          className={[styles.pointillism, image && styles.overPhoto]
            .filter(Boolean)
            .join(" ")}
        />
      )}
      {wash && <div className={styles.wash} />}

      {/* The garment noun is what a placeholder says instead of showing. A
          photograph says it better, so it goes away when one arrives. */}
      {label && !image && (
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
