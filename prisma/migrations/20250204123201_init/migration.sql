/*
  Warnings:

  - You are about to drop the column `type` on the `posts` table. All the data in the column will be lost.
  - Added the required column `type_media` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_post` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "type",
ADD COLUMN     "type_media" INTEGER NOT NULL,
ADD COLUMN     "type_post" INTEGER NOT NULL;
