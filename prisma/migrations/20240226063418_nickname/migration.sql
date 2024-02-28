/*
  Warnings:

  - You are about to drop the column `name` on the `UserProfile` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "name",
ADD COLUMN     "nickname" TEXT NOT NULL;
