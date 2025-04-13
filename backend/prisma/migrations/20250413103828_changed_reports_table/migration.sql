/*
  Warnings:

  - Added the required column `week` to the `report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `report` ADD COLUMN `status` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `week` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Marks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teamId` INTEGER NULL,
    `LA1_marks` INTEGER NULL,
    `LA2_marks` INTEGER NULL,
    `ESE_marks` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
