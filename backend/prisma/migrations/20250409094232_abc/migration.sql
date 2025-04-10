/*
  Warnings:

  - Added the required column `password` to the `guide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `guide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `guide` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `phone` VARCHAR(191) NOT NULL;
