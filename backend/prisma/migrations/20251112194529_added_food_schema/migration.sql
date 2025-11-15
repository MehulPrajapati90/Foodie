-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "video" TEXT NOT NULL,
    "foodPartnerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "linkCount" INTEGER NOT NULL DEFAULT 0,
    "saveCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_foodPartnerId_fkey" FOREIGN KEY ("foodPartnerId") REFERENCES "FoodPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
