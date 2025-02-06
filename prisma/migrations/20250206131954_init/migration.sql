/*
  Warnings:

  - You are about to drop the column `type_post_id` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_type_post_id_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "type_post_id";

-- CreateTable
CREATE TABLE "post_type_posts" (
    "post_id" INTEGER NOT NULL,
    "type_post_id" INTEGER NOT NULL,

    CONSTRAINT "post_type_posts_pkey" PRIMARY KEY ("post_id","type_post_id")
);

-- AddForeignKey
ALTER TABLE "post_type_posts" ADD CONSTRAINT "post_type_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_type_posts" ADD CONSTRAINT "post_type_posts_type_post_id_fkey" FOREIGN KEY ("type_post_id") REFERENCES "type_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
