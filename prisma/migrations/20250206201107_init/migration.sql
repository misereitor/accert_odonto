/*
  Warnings:

  - Made the column `facebook` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `instagram` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `whatsapp` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telephone` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "facebook" SET NOT NULL,
ALTER COLUMN "instagram" SET NOT NULL,
ALTER COLUMN "whatsapp" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "telephone" SET NOT NULL;
