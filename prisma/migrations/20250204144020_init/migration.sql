/*
  Warnings:

  - Made the column `type_media` on table `type_post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "type_post" ALTER COLUMN "type_media" SET NOT NULL;
