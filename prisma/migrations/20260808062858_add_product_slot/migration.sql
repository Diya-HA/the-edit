-- CreateEnum
CREATE TYPE "Slot" AS ENUM ('TOP', 'BOTTOM', 'OUTER', 'SHOES', 'BAG', 'ACCESSORY');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "slot" "Slot";

-- CreateIndex
CREATE INDEX "products_slot_idx" ON "products"("slot");
