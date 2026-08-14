"use client";

import Image from "next/image";
import { useState } from "react";
import { atWidth } from "@/lib/images";
import styles from "./CanvasSwatch.module.css";

export type ProductImageProps = {
  src: string;
  alt: string;
  width: number;
  priority?: boolean;
  /** The garment noun, shown again if the photograph never arrives. */
  label?: string;
  labelLarge?: boolean;
};

/**
 * A photograph that knows how to not be there.
 *
 * The images are hosted by the brands, not by us, and brands delete things:
 * a piece sells out, a season ends, a CDN path changes. When that happens the
 * browser draws its own broken-image glyph, which is the single most
 * unfinished-looking thing a shopping app can show.
 *
 * On failure the image simply stops rendering, and what remains is the field
 * underneath — the fabric tone, or the photograph's own measured ground. That
 * is a card the colour of the cloth with the garment's name on it, which is
 * what the app looked like before there were photographs at all. Degrading to
 * an earlier version of yourself is a good way to fail.
 *
 * A client component only because failure is a runtime event; the field it
 * falls back to is painted by the server.
 */
export default function ProductImage({
  src,
  alt,
  width,
  priority = false,
  label,
  labelLarge = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  /* The garment noun comes back with it. It is suppressed while a photograph
     is expected, because a photograph says what a thing is better than a word
     does — but with no photograph, the word is all there is. */
  if (failed) {
    return label ? (
      <div className={[styles.label, labelLarge && styles.labelLarge].filter(Boolean).join(" ")}>
        {label}
      </div>
    ) : null;
  }

  return (
    <Image
      src={atWidth(src, width)}
      alt={alt}
      fill
      priority={priority}
      className={styles.photo}
      onError={() => setFailed(true)}
    />
  );
}
