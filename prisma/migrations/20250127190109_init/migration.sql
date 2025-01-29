/*
  Warnings:

  - Added the required column `height` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "type" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
