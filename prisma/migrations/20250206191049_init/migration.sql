/*
  Warnings:

  - You are about to drop the column `telefone` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "telefone",
ADD COLUMN     "telephone" TEXT;
