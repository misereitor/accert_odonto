/*
  Warnings:

  - You are about to drop the column `user_id` on the `square` table. All the data in the column will be lost.
  - Added the required column `posts_id` to the `square` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "square" DROP CONSTRAINT "square_user_id_fkey";

-- AlterTable
ALTER TABLE "square" DROP COLUMN "user_id",
ADD COLUMN     "posts_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "square" ADD CONSTRAINT "square_posts_id_fkey" FOREIGN KEY ("posts_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
