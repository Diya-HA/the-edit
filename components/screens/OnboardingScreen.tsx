"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { adoptLook } from "@/app/actions";
import type { AestheticView, PaletteEntry } from "@/lib/data";
import Button from "../Button";
import Chip from "../Chip";
import styles from "./OnboardingScreen.module.css";

export type OnboardingScreenProps = {
  looks: AestheticView[];
  palette: PaletteEntry[];
  /** Tones shown on the first-look card, keyed by look slug. */
  tonesByLook: Record<string, string[]>;
};

const BUDGETS = ["$150", "$300", "$500", "No ceiling"];

/**
 * Getting started — three washed screens, ending on home.
 *
 * Only the chosen look is written down; it becomes the look home opens on.
 * The colours and the budget shape the conversation but have nowhere to live
 * in the v1 schema, so they stay in the flow rather than inventing columns
 * for them.
 */
export default function OnboardingScreen({
  looks,
  palette,
  tonesByLook,
}: OnboardingScreenProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [look, setLook] = useState(looks[0]?.slug ?? "");
  const [colours, setColours] = useState<string[]>(
    palette.slice(0, 3).map((p) => p.token),
  );
  const [budget, setBudget] = useState("$300");
  const [busy, setBusy] = useState(false);

  const chosen = looks.find((l) => l.slug === look) ?? looks[0];

  const finish = async () => {
    setBusy(true);
    if (chosen) await adoptLook(chosen.id);
    router.push("/");
  };

  const bars = (
    <div className={styles.bars}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={[styles.bar, n <= step && styles.barOn]
            .filter(Boolean)
            .join(" ")}
        />
      ))}
    </div>
  );

  return (
    <div
      className={[styles.screen, step === 3 && styles.finale]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.wash} />
      <div className={styles.veil} />

      {step === 1 && (
        <div className={styles.content}>
          {bars}
          <h1 className={styles.heading}>
            What are you
            <br />
            into right now?
          </h1>
          <p className={styles.blurb}>
            Type it however it comes out. Half formed is completely fine and
            rambling is encouraged.
          </p>

          <div className={styles.card}>
            <p className={styles.quote}>
              “Soft and a bit undone. Lots of layers in warm neutrals with one
              thing that’s butter yellow.”
            </p>
          </div>

          <div className={styles.eyebrow}>Or pinch one to start</div>
          <div className={styles.chips}>
            {looks.map((l) => (
              <Chip
                key={l.id}
                label={l.name}
                active={l.slug === look}
                onClick={() => setLook(l.slug)}
              />
            ))}
          </div>

          <div className={styles.actions}>
            <Button full onClick={() => setStep(2)}>
              Next
            </Button>
            <button
              type="button"
              className={styles.skip}
              onClick={finish}
              disabled={busy}
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.content}>
          {bars}
          <h1 className={styles.heading}>
            Which colours
            <br />
            do you wear?
          </h1>
          <p className={styles.blurb}>
            Pick a few. Nothing is permanent and taste wanders.
          </p>

          <div className={styles.swatches}>
            {palette.map((p) => {
              const on = colours.includes(p.token);
              return (
                <button
                  key={p.token}
                  type="button"
                  aria-pressed={on}
                  aria-label={p.name}
                  className={[styles.swatch, on && styles.swatchOn]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ "--swatch-tone": p.color } as CSSProperties}
                  onClick={() =>
                    setColours((c) =>
                      on ? c.filter((t) => t !== p.token) : [...c, p.token],
                    )
                  }
                />
              );
            })}
          </div>

          <div className={styles.eyebrow}>What counts as a lot for one piece?</div>
          <div className={styles.budgets}>
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={budget === b}
                className={[styles.budget, budget === b && styles.budgetOn]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setBudget(b)}
              >
                {b}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button full onClick={() => setStep(3)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={`${styles.content} ${styles.centred}`}>
          <div className={styles.heart}>♥</div>
          <h1 className={styles.heading}>
            Nice eye!
            <br />
            It’s all yours.
          </h1>
          <p className={styles.blurb}>
            Everything in here was picked to sit next to everything else. Keep
            what you love and it gets sharper by the day.
          </p>

          <div className={styles.card}>
            <div className={styles.eyebrow}>Your first look</div>
            <div className={styles.lookName}>{chosen?.name}</div>
            <p className={styles.lookBlurb}>
              {chosen?.description}
              {budget === "No ceiling"
                ? ". No ceiling on price."
                : `. Mostly under ${budget}.`}
            </p>
            <div className={styles.tones}>
              {(tonesByLook[chosen?.slug ?? ""] ?? []).map((tone, i) => (
                <span
                  key={i}
                  className={styles.tone}
                  style={{ "--tone": tone } as CSSProperties}
                />
              ))}
            </div>
          </div>

          <Button full onClick={finish} disabled={busy}>
            Take me in
          </Button>
        </div>
      )}
    </div>
  );
}
