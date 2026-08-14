import AppShell from "@/components/AppShell";
import BoardsScreen from "@/components/screens/BoardsScreen";
import { getEdits } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function BoardsPage() {
  const user = await getCurrentUser();
  const edits = await getEdits(user.id);

  return (
    <AppShell>
      <BoardsScreen
        edits={edits}
        displayName={user.displayName}
        initials={user.initials}
        priceCeiling={user.priceCeiling}
      />
    </AppShell>
  );
}
