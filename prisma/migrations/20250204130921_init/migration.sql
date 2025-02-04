/*
  Warnings:

  - You are about to drop the column `type_media_id` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `type_media` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type_media` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_type_media_id_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "type_media_id",
ADD COLUMN     "type_media" INTEGER NOT NULL;

-- DropTable
DROP TABLE "type_media";
