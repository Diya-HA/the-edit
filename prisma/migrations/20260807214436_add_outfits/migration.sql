-- CreateEnum
CREATE TYPE "Source" AS ENUM ('SEED', 'AGENT', 'HUMAN');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "trendingRank" INTEGER;

-- CreateTable
CREATE TABLE "outfits" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "source" "Source" NOT NULL DEFAULT 'SEED',
    "aestheticId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outfits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_items" (
    "outfitId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "note" TEXT,

    CONSTRAINT "outfit_items_pkey" PRIMARY KEY ("outfitId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "outfits_slug_key" ON "outfits"("slug");

-- CreateIndex
CREATE INDEX "outfits_aestheticId_idx" ON "outfits"("aestheticId");

-- CreateIndex
CREATE INDEX "outfit_items_productId_idx" ON "outfit_items"("productId");

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_aestheticId_fkey" FOREIGN KEY ("aestheticId") REFERENCES "aesthetics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "outfits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
