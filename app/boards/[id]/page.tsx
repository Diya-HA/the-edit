import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import BoardDetailScreen from "@/components/screens/BoardDetailScreen";
import { getEdit } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function BoardPage({ params }: PageProps<"/boards/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();

  const board = await getEdit(id, user.id);
  if (!board) notFound();

  return (
    <AppShell>
      <BoardDetailScreen edit={board.edit} items={board.items} />
    </AppShell>
  );
}
