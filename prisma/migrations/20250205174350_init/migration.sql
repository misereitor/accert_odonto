/*
  Warnings:

  - You are about to drop the column `square_height` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `square_width` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `square_x` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `square_y` on the `posts` table. All the data in the column will be lost.
  - Added the required column `accept_information` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "square_height",
DROP COLUMN "square_width",
DROP COLUMN "square_x",
DROP COLUMN "square_y",
ADD COLUMN     "accept_information" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "square" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "square_x" INTEGER NOT NULL DEFAULT 0,
    "square_y" INTEGER NOT NULL DEFAULT 0,
    "square_width" INTEGER NOT NULL DEFAULT 0,
    "square_height" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "square_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "square" ADD CONSTRAINT "square_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
