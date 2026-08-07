"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleSave } from "@/app/actions";
import type {
  AestheticView,
  FeedBlock,
  PaletteEntry,
  ProductView,
} from "@/lib/data";
import Avatar from "../Avatar";
import Button from "../Button";
import Chip from "../Chip";
import ColorDot from "../ColorDot";
import ProductCard from "../ProductCard";
import Toast from "../Toast";
import styles from "./FeedScreen.module.css";

export type FeedScreenProps = {
  blocks: FeedBlock[];
  aesthetics: AestheticView[];
  palette: PaletteEntry[];
  activeSlug: string;
  activeName: string;
  selectedTokens: string[];
  initials: string;
};

export default function FeedScreen({
  blocks,
  aesthetics,
  palette,
  activeSlug,
  activeName,
  selectedTokens,
  initials,
}: FeedScreenProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const say = (message: string) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(""), 2600);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  /* Filters live in the URL, so a filtered feed is shareable and the back
     button walks the looks you tried. */
  const navigate = (look: string, tokens: string[]) => {
    const params = new URLSearchParams();
    params.set("look", look);
    for (const t of tokens) params.append("tint", t);
    startTransition(() => router.push(`/?${params}`, { scroll: false }));
  };

  const pickLook = (slug: string, name: string) => {
    if (slug === activeSlug) return;
    navigate(slug, selectedTokens);
    say(`${name} is your home feed now. Enjoy`);
  };

  const toggleTint = (token: string) => {
    const next = selectedTokens.includes(token)
      ? selectedTokens.filter((t) => t !== token)
      : [...selectedTokens, token];
    navigate(activeSlug, next);
  };

  const save = (product: ProductView) => {
    startTransition(async () => {
      const result = await toggleSave(product.id, activeName);
      say(result.message);
    });
  };

  const card = (p: ProductView, featured: boolean) => (
    <ProductCard
      brand={p.brand}
      title={p.title}
      price={p.price}
      was={p.wasPrice ?? undefined}
      color={p.color}
      line={p.line ?? undefined}
      featured={featured}
      saved={p.saved}
      onSave={() => save(p)}
      onOpen={() => router.push(`/product/${p.slug}`)}
    />
  );

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.wordmark}>The Edit</div>
          <Avatar initials={initials} size={26} />
        </div>

        <div className={styles.chips}>
          {aesthetics.map((a) => (
            <Chip
              key={a.id}
              label={a.name}
              active={a.slug === activeSlug}
              onClick={() => pickLook(a.slug, a.name)}
            />
          ))}
          <Chip label="＋ Write your own" dashed />
        </div>

        <div className={styles.palette}>
          <span className={styles.paletteLabel}>PALETTE</span>
          <div className={styles.dots}>
            {palette.map((p) => (
              <ColorDot
                key={p.token}
                color={p.color}
                label={p.name}
                active={selectedTokens.includes(p.token)}
                onClick={() => toggleTint(p.token)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.feed}>
          {blocks.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>Nothing in this shade just yet</div>
            <p className={styles.emptyBody}>
              We add new pieces all the time, so it won’t stay empty for long. In
              the meantime, may we show you the rest of the look?
            </p>
            <Button size="sm" onClick={() => navigate(activeSlug, [])}>
              Show everything
            </Button>
          </div>
        ) : (
          <div className={pending ? styles.pending : undefined}>
            {blocks.map((block) => (
              <div key={block.hero.id} className={styles.block}>
                {card(block.hero, true)}

                {block.pair.length > 0 && (
                  <div className={styles.pair}>
                    {block.pair.map((p) => (
                      <div key={p.id} className={styles.pairItem}>
                        {card(p, false)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      <Toast message={toast} />
    </>
  );
}
