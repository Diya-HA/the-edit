import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import ProductScreen from "@/components/screens/ProductScreen";
import { getEdits, getProduct, getWearsWellWith } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const product = await getProduct(slug, user.id);
  if (!product) notFound();

  const [wearsWellWith, edits] = await Promise.all([
    getWearsWellWith({
      userId: user.id,
      aestheticId: product.aestheticId,
      excludeId: product.id,
    }),
    getEdits(user.id, product.id),
  ]);

  return (
    <AppShell>
      <ProductScreen
        product={product}
        wearsWellWith={wearsWellWith}
        edits={edits}
        lookName={product.aestheticName}
      />
    </AppShell>
  );
}
