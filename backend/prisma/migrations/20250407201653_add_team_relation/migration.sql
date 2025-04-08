/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Idea` MODIFY `approved` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Team_id_unique` ON `team`(`id`);

-- AddForeignKey
ALTER TABLE `batch` ADD CONSTRAINT `batch_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `guide`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Idea` ADD CONSTRAINT `Idea_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `batch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `guide`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
