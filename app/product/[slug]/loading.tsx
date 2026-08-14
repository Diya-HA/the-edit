import AppShell from "@/components/AppShell";
import { ProductSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <AppShell>
      <ProductSkeleton />
    </AppShell>
  );
}
