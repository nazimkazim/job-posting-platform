/*
  Warnings:

  - You are about to drop the column `submittedAt` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `JobPost` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_jobPostId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "submittedAt";

-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
