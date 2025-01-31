/*
  Warnings:

  - The `filter` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "filter",
ADD COLUMN     "filter" TEXT[];
