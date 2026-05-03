/*
  Warnings:

  - A unique constraint covering the columns `[userId,ingredientId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `cookingTime` VARCHAR(191) NULL DEFAULT '20',
    ADD COLUMN `difficulty` VARCHAR(191) NULL DEFAULT 'Media',
    MODIFY `description` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Inventory_userId_ingredientId_key` ON `Inventory`(`userId`, `ingredientId`);
