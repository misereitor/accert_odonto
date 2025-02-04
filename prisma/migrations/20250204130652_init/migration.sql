/*
  Warnings:

  - You are about to drop the column `type_media` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `type_postid` on the `posts` table. All the data in the column will be lost.
  - Added the required column `type_media_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_post_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_type_postid_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "type_media",
DROP COLUMN "type_postid",
ADD COLUMN     "type_media_id" INTEGER NOT NULL,
ADD COLUMN     "type_post_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "type_media" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "type_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_type_post_id_fkey" FOREIGN KEY ("type_post_id") REFERENCES "type_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_type_media_id_fkey" FOREIGN KEY ("type_media_id") REFERENCES "type_media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
