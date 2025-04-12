/*
  Warnings:

  - Added the required column `year` to the `guide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `batch` ADD COLUMN `year` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `guide` ADD COLUMN `year` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `year` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `team` ADD COLUMN `year` INTEGER NOT NULL;
