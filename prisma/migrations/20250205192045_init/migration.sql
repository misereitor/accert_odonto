/*
  Warnings:

  - Made the column `timestampUrl` on table `logos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `logos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timestampUrl` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "logos" ALTER COLUMN "timestampUrl" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "timestampUrl" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL;
