-- AlterTable
ALTER TABLE "Label" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "length" INTEGER NOT NULL DEFAULT 30,
    "width" INTEGER NOT NULL DEFAULT 20,
    "height" INTEGER NOT NULL DEFAULT 10,
    "value" DOUBLE PRECISION,
    "contents" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;
