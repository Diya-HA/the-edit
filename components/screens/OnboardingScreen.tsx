"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { completeOnboarding } from "@/app/actions";
import { CEILINGS, ceilingLabel } from "@/lib/budget";
import { matchLook } from "@/lib/mood";
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

/* The rungs live in app/actions so the welcome and the settings row cannot
   drift apart — a ceiling offered here but not there would be a bug nobody
   sees until a feed empties. */
const BUDGETS = CEILINGS;

/**
 * Getting started — three washed screens, ending on home.
 *
 * All three answers are written down now. The look becomes the one home opens
 * on, the palette is kept for later, and the ceiling filters the feed — which
 * matters more than it sounds, because the labels behind a look decide its
 * price bracket, so a ceiling can quietly empty an aesthetic. When it does,
 * home says so rather than just being short.
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
  const [budget, setBudget] = useState<number | null>(300);
  const [busy, setBusy] = useState(false);

  /* What they typed, and whether they have since picked a chip themselves.
     Once someone has chosen, their choice stands and typing stops moving it —
     an app that keeps overriding you is worse than one that never guessed. */
  const [mood, setMood] = useState("");
  const [chosenByHand, setChosenByHand] = useState(false);

  const guess = mood.trim() ? matchLook(mood, looks.map((l) => l.slug)) : null;

  /* The guess wins while they are still typing; their own tap wins after. A
     sentence the matcher does not recognise returns null and changes nothing,
     which is the common case and has to feel like nothing happening. */
  const activeSlug = !chosenByHand && guess ? guess.slug : look;
  const chosen = looks.find((l) => l.slug === activeSlug) ?? looks[0];

  /**
   * Finish, or decline to.
   *
   * Skipping used to run the same path as answering, which quietly recorded
   * the defaults — a $300 ceiling and three palette colours nobody had
   * chosen. A ceiling filters the feed, so that is a preference invented on
   * someone's behalf and then acted on.
   *
   * Declining still records the look, because home has to open on something,
   * and still stamps onboardedAt, because the question *was* put. What it does
   * not do is answer for them: no ceiling, no palette.
   */
  const finish = async (skipped = false) => {
    setBusy(true);
    if (chosen) {
      await completeOnboarding({
        aestheticId: chosen.id,
        palette: skipped ? [] : colours,
        priceCeiling: skipped ? null : budget,
        /* Kept even when they skip the rest — they still said it. */
        moodNote: mood.trim() || null,
      });
    }
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
            <textarea
              className={styles.quote}
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              rows={3}
              maxLength={280}
              aria-label="Describe what you are into"
              placeholder="Soft and a bit undone. Lots of layers in warm neutrals with one thing that’s butter yellow."
            />
          </div>

          {/* Says what it heard, as it hears it. A guess nobody can see is
              indistinguishable from a default. */}
          {guess && !chosenByHand && (
            <p className={styles.guess} role="status">
              Sounds like {chosen?.name.toLowerCase()}.
            </p>
          )}

          <div className={styles.eyebrow}>Or start from one of these</div>
          <div className={styles.chips}>
            {looks.map((l) => (
              <Chip
                key={l.id}
                label={l.name}
                active={l.slug === activeSlug}
                onClick={() => {
                  setChosenByHand(true);
                  setLook(l.slug);
                }}
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
              onClick={() => finish(true)}
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
            Which colours pull you in?
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
                key={String(b)}
                type="button"
                aria-pressed={budget === b}
                className={[styles.budget, budget === b && styles.budgetOn]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setBudget(b)}
              >
                {ceilingLabel(b)}
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
            Nice eye.
            <br />
            It’s all yours.
          </h1>
          <p className={styles.blurb}>
            Everything in here was picked to sit next to everything else. Keep
            what you love and it gets sharper by the day.
          </p>

          <div className={styles.card}>
            {/* Their words, back to them. The point of letting someone
                describe a mood is that they are heard, and it makes the guess
                visible — when it lands it looks clever, and when it misses
                they can see why rather than wondering. */}
            {mood.trim() && (
              <p className={styles.echo}>
                You said: <span className={styles.echoWords}>{mood.trim()}</span>
              </p>
            )}

            <div className={styles.eyebrow}>Your first look</div>
            <div className={styles.lookName}>{chosen?.name}</div>
            <p className={styles.lookBlurb}>
              {chosen?.description}
              {budget === null
                ? ". No ceiling on price."
                : `. Mostly under ${ceilingLabel(budget)}.`}
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

          <Button full onClick={() => finish(false)} disabled={busy}>
            Take me in
          </Button>
        </div>
      )}
    </div>
  );
}
