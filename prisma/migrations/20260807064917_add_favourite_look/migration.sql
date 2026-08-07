-- CreateTable
CREATE TABLE "favourite_looks" (
    "userId" UUID NOT NULL,
    "aestheticId" UUID NOT NULL,
    "starredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favourite_looks_pkey" PRIMARY KEY ("userId","aestheticId")
);

-- CreateIndex
CREATE INDEX "favourite_looks_aestheticId_idx" ON "favourite_looks"("aestheticId");

-- AddForeignKey
ALTER TABLE "favourite_looks" ADD CONSTRAINT "favourite_looks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_looks" ADD CONSTRAINT "favourite_looks_aestheticId_fkey" FOREIGN KEY ("aestheticId") REFERENCES "aesthetics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
