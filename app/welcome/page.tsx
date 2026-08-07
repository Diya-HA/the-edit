import OnboardingScreen from "@/components/screens/OnboardingScreen";
import { getAesthetics, getLooks, getPalette } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import styles from "@/components/AppShell.module.css";

export const dynamic = "force-dynamic";

/**
 * Getting started. No tab bar — you are not in the app yet — so this uses the
 * shell's frame directly rather than AppShell.
 */
export default async function WelcomePage() {
  const user = await getCurrentUser();
  const [looks, palette, withTones] = await Promise.all([
    getAesthetics(user.id),
    getPalette(),
    getLooks(user.id),
  ]);

  const tonesByLook = Object.fromEntries(
    withTones.map((l) => [l.slug, l.tones]),
  );

  return (
    <div className={styles.shell}>
      <div className={styles.screen}>
        <OnboardingScreen
          looks={looks}
          palette={palette}
          tonesByLook={tonesByLook}
        />
      </div>
    </div>
  );
}
