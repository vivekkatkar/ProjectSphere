/*
  Warnings:

  - You are about to drop the column `year` on the `guide` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `guide` DROP COLUMN `year`;

-- AlterTable
ALTER TABLE `team` MODIFY `year` INTEGER NOT NULL DEFAULT 0;
