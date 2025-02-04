/*
  Warnings:

  - You are about to drop the column `type_post` on the `posts` table. All the data in the column will be lost.
  - Added the required column `type_postid` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "type_post",
ADD COLUMN     "type_postid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "type_post" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "type_post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_type_postid_fkey" FOREIGN KEY ("type_postid") REFERENCES "type_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
