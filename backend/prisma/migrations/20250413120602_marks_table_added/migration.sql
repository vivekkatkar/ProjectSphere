/*
  Warnings:

  - Added the required column `year` to the `guide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `guide` ADD COLUMN `year` INTEGER NOT NULL;
