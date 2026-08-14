"use client";

import { useEffect } from "react";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import MessageScreen from "@/components/screens/MessageScreen";

/**
 * Something threw.
 *
 * Error boundaries have to be client components, and they have to offer the
 * retry themselves — `reset` re-renders the segment without a full reload,
 * which for a database hiccup is usually all it takes.
 *
 * The copy says what happened in the app's own voice and does not show the
 * error. A stack trace helps nobody holding a phone, and on a screen someone
 * might be presenting from, it is worse than unhelpful.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* The console is where this belongs — visible to whoever is debugging,
       invisible to whoever is shopping. */
    console.error("Screen failed to render:", error);
  }, [error]);

  return (
    <AppShell>
      <MessageScreen
        eyebrow="Something slipped"
        title="That didn’t load"
        body="Not your doing. Try it again, and if it keeps happening the feed is still there."
      >
        <Button full onClick={reset}>
          Try again
        </Button>
        <ButtonLink href="/" variant="secondary" full>
          Back to the feed
        </ButtonLink>
      </MessageScreen>
    </AppShell>
  );
}
