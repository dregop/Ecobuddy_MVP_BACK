/*
  Warnings:

  - You are about to drop the `daily_impact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "daily_impact" DROP CONSTRAINT "daily_impact_userId_fkey";

-- DropTable
DROP TABLE "daily_impact";

-- CreateTable
CREATE TABLE "DailyImpact" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyImpact" DOUBLE PRECISION NOT NULL,
    "impactDelta" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyImpact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyImpact" ADD CONSTRAINT "DailyImpact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
