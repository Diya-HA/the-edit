import AppShell from "@/components/AppShell";
import ButtonLink from "@/components/ButtonLink";
import MessageScreen from "@/components/screens/MessageScreen";

/**
 * A piece or a board that is not there.
 *
 * Reached by notFound() from the product and board routes, and by any stale
 * URL. Without this file Next serves its own unstyled 404 outside the phone
 * frame, which reads as the app having fallen over rather than a link having
 * gone out of date.
 */
export default function NotFound() {
  return (
    <AppShell>
      <MessageScreen
        eyebrow="Not here"
        title="This one has gone"
        body="Pieces come and go as brands sell through. The rest of the edit is where you left it."
      >
        <ButtonLink href="/" full>
          Back to the feed
        </ButtonLink>
        <ButtonLink href="/search" variant="secondary" full>
          Look for something else
        </ButtonLink>
      </MessageScreen>
    </AppShell>
  );
}
