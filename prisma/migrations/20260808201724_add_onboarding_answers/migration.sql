-- AlterTable
ALTER TABLE "users" ADD COLUMN     "onboardedAt" TIMESTAMP(3),
ADD COLUMN     "palette" TEXT[],
ADD COLUMN     "priceCeiling" INTEGER;
