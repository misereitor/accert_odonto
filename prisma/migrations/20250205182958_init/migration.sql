/*
  Warnings:

  - You are about to drop the `square` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "square" DROP CONSTRAINT "square_posts_id_fkey";

-- DropTable
DROP TABLE "square";

-- CreateTable
CREATE TABLE "squares" (
    "id" SERIAL NOT NULL,
    "posts_id" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "x" INTEGER NOT NULL DEFAULT 0,
    "y" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "squares_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "squares" ADD CONSTRAINT "squares_posts_id_fkey" FOREIGN KEY ("posts_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
