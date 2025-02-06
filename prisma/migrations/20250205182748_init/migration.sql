/*
  Warnings:

  - You are about to drop the column `square_height` on the `square` table. All the data in the column will be lost.
  - You are about to drop the column `square_width` on the `square` table. All the data in the column will be lost.
  - You are about to drop the column `square_x` on the `square` table. All the data in the column will be lost.
  - You are about to drop the column `square_y` on the `square` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "square" DROP COLUMN "square_height",
DROP COLUMN "square_width",
DROP COLUMN "square_x",
DROP COLUMN "square_y",
ADD COLUMN     "height" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "width" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "x" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "y" INTEGER NOT NULL DEFAULT 0;
