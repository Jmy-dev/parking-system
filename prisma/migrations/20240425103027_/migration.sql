-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_userId_fkey";

-- AlterTable
ALTER TABLE "Slot" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
