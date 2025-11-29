/*
  Warnings:

  - Made the column `address` on table `candidates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "experienceYears" INTEGER,
ADD COLUMN     "hourlyRate" DOUBLE PRECISION,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zipCode" TEXT,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "address" SET DEFAULT '{}',
ALTER COLUMN "skills" SET DEFAULT '[]',
ALTER COLUMN "languages" SET DEFAULT '[]',
ALTER COLUMN "availability" SET DEFAULT '{}';
