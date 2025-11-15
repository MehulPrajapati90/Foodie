/*
  Warnings:

  - You are about to drop the `FoodVendor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FoodVendor";

-- CreateTable
CREATE TABLE "FoodPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodPartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodPartner_email_key" ON "FoodPartner"("email");

-- CreateIndex
CREATE INDEX "FoodPartner_email_idx" ON "FoodPartner"("email");
