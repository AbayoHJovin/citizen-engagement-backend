-- CreateEnum
CREATE TYPE "AdminstrationScope" AS ENUM ('PROVINCE', 'DISTRICT', 'SECTOR', 'CELL', 'VILLAGE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminstrationScope" "AdminstrationScope";
