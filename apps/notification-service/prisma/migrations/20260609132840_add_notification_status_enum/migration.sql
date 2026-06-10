/*
  Warnings:

  - The `status` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'RETRYING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING';
