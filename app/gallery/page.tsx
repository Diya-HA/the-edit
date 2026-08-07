"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Avatar,
  Badge,
  BoardCard,
  BottomSheet,
  BrandRow,
  Button,
  CanvasSwatch,
  Chip,
  ColorDot,
  ProductCard,
  TabBar,
  Toast,
} from "@/components";
import styles from "./page.module.css";

const LOOKS = [
  { id: "soft-romance", name: "Soft romance" },
  { id: "library-cardigan", name: "Library cardigan" },
  { id: "quiet-utility", name: "Quiet utility" },
  { id: "wabi-sabi", name: "Wabi sabi linen" },
];

const PALETTE = [
  { id: "butter", name: "Butter", color: "var(--fabric-butter)" },
  { id: "rose", name: "Rose", color: "var(--fabric-rose)" },
  { id: "coral", name: "Coral", color: "var(--fabric-rust)" },
  { id: "blue", name: "Blue", color: "var(--fabric-indigo)" },
  { id: "sage", name: "Sage", color: "var(--fabric-sage)" },
  { id: "violet", name: "Violet", color: "var(--fabric-ink)" },
];

const PIECES = [
  {
    id: "p10",
    brand: "Kin & Cloth",
    title: "Slub linen dress",
    price: 210,
    color: "var(--fabric-butter)",
    line: "The dress the whole look was built around.",
  },
  {
    id: "p3",
    brand: "Ciel",
    title: "Ribbon tie ballet flat",
    price: 96,
    was: 140,
    color: "var(--fabric-rose)",
  },
  {
    id: "p6",
    brand: "Halle",
    title: "Lambswool cardigan",
    price: 118,
    color: "var(--fabric-rust)",
  },
];

const BOARDS = [
  {
    id: "b1",
    name: "Soft romance",
    count: 14,
    note: "Growing since March",
    colors: ["var(--fabric-rose)", "var(--fabric-butter)", "var(--fabric-sage)"],
  },
  {
    id: "b3",
    name: "Linen summer",
    count: 21,
    note: "For Sicily, hopefully",
    colors: ["var(--fabric-sage)", "var(--fabric-cream)", "var(--fabric-indigo)"],
  },
];

const BRANDS = [
  { id: "margaux", name: "Margaux", meta: "Three of theirs live on your boards", color: "var(--fabric-rose)" },
  { id: "ciel", name: "Ciel", meta: "Two prices came down this week", color: "var(--fabric-indigo)" },
  { id: "alder", name: "Alder & Oak", meta: "New linen just arrived", color: "var(--fabric-sage)" },
];

export default function Page() {
  const [look, setLook] = useState("soft-romance");
  const [palette, setPalette] = useState<string[]>([]);
  const [saved, setSaved] = useState<Record<string, boolean>>({ p3: true });
  const [following, setFollowing] = useState<Record<string, boolean>>({
    margaux: true,
  });
  const [tab, setTab] = useState("feed");
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const say = (message: string) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(""), 2600);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  const toggleSave = (id: string, title: string) => {
    const on = !saved[id];
    setSaved((s) => ({ ...s, [id]: on }));
    say(on ? `Saved ${title.toLowerCase()} ♥` : "No problem. It's off your list");
  };

  const togglePalette = (id: string, name: string) => {
    const on = !palette.includes(id);
    setPalette((p) => (on ? [...p, id] : p.filter((x) => x !== id)));
    say(on ? `Filtering to ${name.toLowerCase()}` : "Showing everything again");
  };

  const toggleFollow = (id: string, name: string) => {
    const on = !following[id];
    setFollowing((f) => ({ ...f, [id]: on }));
    say(
      on
        ? `You're following ${name}. We'll tell you the moment a price drops`
        : `Unfollowed ${name}. You're always welcome back`,
    );
  };

  const [hero, ...rest] = PIECES;

  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <div className={styles.wordmark}>The Edit</div>
        <p className={styles.tagline}>One aesthetic, every brand.</p>
      </header>

      <div className={styles.layout}>
        {/* ---- The app frame ---- */}
        <div className={styles.phone}>
          <div className={styles.screen}>
            <div className={styles.status}>
              <span>9:41</span>
              <span className={styles.signal}>▮▮▮ ⌁ ▰</span>
            </div>

            <div className={styles.header}>
              <div className={styles.headerTop}>
                <div className={styles.brandmark}>The Edit</div>
                <Avatar initials="AL" size={26} />
              </div>

              <div className={styles.chips}>
                {LOOKS.map((l) => (
                  <Chip
                    key={l.id}
                    label={l.name}
                    active={look === l.id}
                    onClick={() => {
                      setLook(l.id);
                      say(`${l.name} is your home feed now. Enjoy`);
                    }}
                  />
                ))}
                <Chip label="＋ Write your own" dashed />
              </div>

              <div className={styles.palette}>
                <span className={styles.paletteLabel}>PALETTE</span>
                <div className={styles.dots}>
                  {PALETTE.map((p) => (
                    <ColorDot
                      key={p.id}
                      color={p.color}
                      label={p.name}
                      active={palette.includes(p.id)}
                      onClick={() => togglePalette(p.id, p.name)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.feed}>
              <div className={styles.block}>
                <ProductCard
                  featured
                  brand={hero.brand}
                  title={hero.title}
                  price={hero.price}
                  color={hero.color}
                  line={hero.line}
                  saved={!!saved[hero.id]}
                  onSave={() => toggleSave(hero.id, hero.title)}
                  onOpen={() => say(`Opening ${hero.title.toLowerCase()}`)}
                />

                <div className={styles.pair}>
                  {rest.map((p) => (
                    <div key={p.id} className={styles.pairItem}>
                      <ProductCard
                        brand={p.brand}
                        title={p.title}
                        price={p.price}
                        was={p.was}
                        color={p.color}
                        saved={!!saved[p.id]}
                        onSave={() => toggleSave(p.id, p.title)}
                        onOpen={() => say(`Opening ${p.title.toLowerCase()}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <TabBar
              active={tab}
              onChange={setTab}
              items={[
                { key: "feed", label: "Home", icon: "home" },
                { key: "search", label: "Search" },
                { key: "boards", label: "Boards" },
                { key: "you", label: "You" },
              ]}
            />

            <div className={styles.homeIndicator} />

            <Toast message={toast} />

            <BottomSheet
              open={sheet}
              title="Where shall we save it?"
              onClose={() => setSheet(false)}
            >
              {BOARDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={styles.sheetRow}
                  onClick={() => {
                    setSheet(false);
                    say(`Saved to ${b.name}. It's coming together nicely`);
                  }}
                >
                  <span
                    className={styles.sheetThumb}
                    style={
                      { "--sheet-thumb-color": b.colors[0] } as CSSProperties
                    }
                  />
                  <span className={styles.sheetText}>
                    <span className={styles.sheetName}>{b.name}</span>
                    <span className={styles.sheetNote}>{b.note}</span>
                  </span>
                </button>
              ))}
            </BottomSheet>
          </div>
        </div>

        {/* ---- Specimens ---- */}
        <div className={styles.specimens}>
          <section className={styles.section}>
            <div className={styles.eyebrow}>Buttons</div>
            <div className={styles.inline}>
              <Button onClick={() => setSheet(true)}>Save to a board</Button>
              <Button variant="secondary">Buy</Button>
              <Button variant="brand" size="sm">
                Follow
              </Button>
              <Button variant="ghost" size="sm">
                Skip for now
              </Button>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.eyebrow}>Badges &amp; avatars</div>
            <div className={styles.inline}>
              <Badge tone="drop">↓ 25%</Badge>
              <Badge tone="sale">↓ 31%</Badge>
              <Badge tone="ink">NEW</Badge>
              <Badge tone="cobalt">EDIT</Badge>
              <Badge tone="outline">SAVED</Badge>
              <Avatar initials="AL" size={38} />
              <Avatar initials="DK" size={38} color="var(--brand)" />
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.eyebrow}>Canvas swatch</div>
            <CanvasSwatch
              color="var(--fabric-sage)"
              height={150}
              label="Cardigan"
            />
          </section>

          <section className={styles.section}>
            <div className={styles.eyebrow}>Boards</div>
            <div className={styles.boards}>
              {BOARDS.map((b) => (
                <BoardCard
                  key={b.id}
                  name={b.name}
                  count={b.count}
                  note={b.note}
                  colors={b.colors}
                  onOpen={() => say(`Opening ${b.name}`)}
                />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.eyebrow}>Labels on your shelf</div>
            <div className={styles.rowGroup}>
              {BRANDS.map((b) => (
                <BrandRow
                  key={b.id}
                  name={b.name}
                  meta={b.meta}
                  color={b.color}
                  following={!!following[b.id]}
                  onFollow={() => toggleFollow(b.id, b.name)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
