/*
  Warnings:

  - Added the required column `accept_logo` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "accept_logo" BOOLEAN NOT NULL;
