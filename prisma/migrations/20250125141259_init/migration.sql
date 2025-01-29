/*
  Warnings:

  - Added the required column `filter` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "description" TEXT,
ADD COLUMN     "filter" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "size" BIGINT NOT NULL;
