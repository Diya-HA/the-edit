import AppShell from "@/components/AppShell";
import ShelfScreen from "@/components/screens/ShelfScreen";
import { getBrands, getDrops } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ShelfPage() {
  const user = await getCurrentUser();
  const [brands, drops] = await Promise.all([
    getBrands(user.id),
    getDrops(user.id),
  ]);

  return (
    <AppShell>
      <ShelfScreen brands={brands} drops={drops} />
    </AppShell>
  );
}
