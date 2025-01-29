/*
  Warnings:

  - A unique constraint covering the columns `[name_unique]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_unique` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "name_unique" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "posts_name_unique_key" ON "posts"("name_unique");
