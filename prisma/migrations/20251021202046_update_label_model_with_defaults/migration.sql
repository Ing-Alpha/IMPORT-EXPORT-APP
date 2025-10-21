/*
  Warnings:

  - You are about to drop the column `pdfUrl` on the `Label` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Label" DROP COLUMN "pdfUrl",
ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "destination" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "height" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "length" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'Payé',
ADD COLUMN     "recipientCity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "recipientName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "recipientPhone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "senderCity" TEXT NOT NULL DEFAULT 'Marseille',
ADD COLUMN     "senderName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "senderPhone" TEXT NOT NULL DEFAULT '+33760248507',
ADD COLUMN     "serviceCode" TEXT NOT NULL DEFAULT '1049.00',
ADD COLUMN     "serviceType" TEXT NOT NULL DEFAULT 'Sous 1 semaine | Colisso',
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "width" INTEGER NOT NULL DEFAULT 20;
