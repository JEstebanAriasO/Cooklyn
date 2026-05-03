/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `prepTime` on the `Recipe` table. All the data in the column will be lost.
  - Made the column `instructions` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Recipe` DROP COLUMN `difficulty`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `prepTime`,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `instructions` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `Favorite` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `recipeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Favorite_userId_recipeId_key`(`userId`, `recipeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
