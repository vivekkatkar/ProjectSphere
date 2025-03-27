/*
  Warnings:

  - You are about to drop the column `emaill` on the `guide` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Guide` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Guide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Guide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubLink` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `batch` MODIFY `guideId` INTEGER NULL;

-- AlterTable
ALTER TABLE `guide` DROP COLUMN `emaill`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `semester` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `githubLink` VARCHAR(191) NOT NULL,
    MODIFY `teamId` INTEGER NULL;

-- AlterTable
ALTER TABLE `report` MODIFY `teamId` INTEGER NULL;

-- AlterTable
ALTER TABLE `student` MODIFY `teamId` INTEGER NULL,
    MODIFY `guideId` INTEGER NULL;

-- AlterTable
ALTER TABLE `team` ADD COLUMN `guideId` INTEGER NULL,
    MODIFY `prn` VARCHAR(191) NOT NULL,
    MODIFY `batchId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Guide_email_key` ON `Guide`(`email`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `Guide`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `Guide`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Batch` ADD CONSTRAINT `Batch_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `Guide`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
