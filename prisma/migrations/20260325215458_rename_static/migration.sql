/*
  Warnings:

  - You are about to drop the column `labInchargeId` on the `venue` table. All the data in the column will be lost.
  - You are about to drop the column `labStaffId` on the `venue` table. All the data in the column will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `position` DROP FOREIGN KEY `Position_personInPositionId_fkey`;

-- DropForeignKey
ALTER TABLE `venue` DROP FOREIGN KEY `Venue_labInchargeId_fkey`;

-- DropForeignKey
ALTER TABLE `venue` DROP FOREIGN KEY `Venue_labStaffId_fkey`;

-- DropIndex
DROP INDEX `Position_personInPositionId_fkey` ON `position`;

-- DropIndex
DROP INDEX `Venue_labInchargeId_fkey` ON `venue`;

-- DropIndex
DROP INDEX `Venue_labStaffId_fkey` ON `venue`;

-- AlterTable
ALTER TABLE `venue` DROP COLUMN `labInchargeId`,
    DROP COLUMN `labStaffId`,
    ADD COLUMN `facultyInchargeId` VARCHAR(191) NULL,
    ADD COLUMN `staffInchargeId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `staff`;

-- CreateTable
CREATE TABLE `People` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mobile_no` VARCHAR(191) NOT NULL,
    `designation` ENUM('PROFESSOR', 'DISTINGUISHED_PROFESSOR', 'ASSOCIATE_PROFESSOR', 'ASSISTANT_PROFESSOR', 'TECHNICAL_SUPERINTENDENT', 'JR_TECHNICAL_SUPERINTENDENT', 'JR_TECHNICIAN', 'JR_ASSISTANT') NOT NULL,

    UNIQUE INDEX `People_email_key`(`email`),
    UNIQUE INDEX `People_mobile_no_key`(`mobile_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Position` ADD CONSTRAINT `Position_personInPositionId_fkey` FOREIGN KEY (`personInPositionId`) REFERENCES `People`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venue` ADD CONSTRAINT `Venue_staffInchargeId_fkey` FOREIGN KEY (`staffInchargeId`) REFERENCES `People`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venue` ADD CONSTRAINT `Venue_facultyInchargeId_fkey` FOREIGN KEY (`facultyInchargeId`) REFERENCES `People`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
