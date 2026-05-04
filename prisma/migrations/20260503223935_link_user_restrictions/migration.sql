-- CreateTable
CREATE TABLE `UserRestriction` (
    `userId` VARCHAR(191) NOT NULL,
    `restrictionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `restrictionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRestriction` ADD CONSTRAINT `UserRestriction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRestriction` ADD CONSTRAINT `UserRestriction_restrictionId_fkey` FOREIGN KEY (`restrictionId`) REFERENCES `MedicalRestriction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
