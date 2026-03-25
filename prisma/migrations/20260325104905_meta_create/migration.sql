/*
  Warnings:

  - You are about to drop the `lt` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('DEFAULT', 'ADMIN', 'DEVELOPER') NOT NULL DEFAULT 'DEFAULT';

-- DropTable
DROP TABLE `lt`;

-- CreateTable
CREATE TABLE `Staff` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mobile_no` VARCHAR(191) NOT NULL,
    `designation` ENUM('PROFESSOR', 'DISTINGUISHED_PROFESSOR', 'ASSOCIATE_PROFESSOR', 'ASSISTANT_PROFESSOR', 'TECHNICAL_SUPERINTENDENT', 'JR_TECHNICAL_SUPERINTENDENT', 'JR_TECHNICIAN', 'JR_ASSISTANT') NOT NULL,

    UNIQUE INDEX `Staff_email_key`(`email`),
    UNIQUE INDEX `Staff_mobile_no_key`(`mobile_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Position` (
    `id` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `personInPositionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Position_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venue` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('LECTURE_HALL', 'SEMINAR_HALL', 'LAB') NOT NULL,
    `availableForBooking` BOOLEAN NOT NULL DEFAULT true,
    `labStaffId` VARCHAR(191) NULL,
    `labInchargeId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Position` ADD CONSTRAINT `Position_personInPositionId_fkey` FOREIGN KEY (`personInPositionId`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venue` ADD CONSTRAINT `Venue_labStaffId_fkey` FOREIGN KEY (`labStaffId`) REFERENCES `Staff`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venue` ADD CONSTRAINT `Venue_labInchargeId_fkey` FOREIGN KEY (`labInchargeId`) REFERENCES `Staff`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
