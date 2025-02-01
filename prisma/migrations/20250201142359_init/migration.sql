/*
  Warnings:

  - You are about to drop the column `height` on the `logos` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `logos` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `logos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "logos" DROP COLUMN "height",
DROP COLUMN "size",
DROP COLUMN "width";
