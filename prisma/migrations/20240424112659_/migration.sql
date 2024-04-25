/*
  Warnings:

  - You are about to drop the column `belongsToId` on the `OTP` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `OTP` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `OTP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_belongsToId_fkey";

-- AlterTable
ALTER TABLE "OTP" DROP COLUMN "belongsToId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OTP_userId_key" ON "OTP"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Slot_userId_key" ON "Slot"("userId");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
