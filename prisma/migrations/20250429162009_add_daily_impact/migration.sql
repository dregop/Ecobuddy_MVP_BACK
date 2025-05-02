-- CreateTable
CREATE TABLE "daily_impact" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyImpact" DOUBLE PRECISION NOT NULL,
    "impactDelta" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_impact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "daily_impact" ADD CONSTRAINT "daily_impact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
