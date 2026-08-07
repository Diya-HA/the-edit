import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import ProductScreen from "@/components/screens/ProductScreen";
import { getEdits, getProduct, getSitsWellWith } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const product = await getProduct(slug, user.id);
  if (!product) notFound();

  const [sitsWellWith, edits] = await Promise.all([
    getSitsWellWith({
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
        sitsWellWith={sitsWellWith}
        edits={edits}
        lookName={product.aestheticName}
      />
    </AppShell>
  );
}
