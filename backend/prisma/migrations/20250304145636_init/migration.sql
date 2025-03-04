/*
  Warnings:

  - You are about to drop the `plantneed` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `age` to the `p_factor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `p_nutrient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plant_id` to the `plant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `p_factor` DROP FOREIGN KEY `p_factor_plant_id_fkey`;

-- DropForeignKey
ALTER TABLE `p_nutrient` DROP FOREIGN KEY `p_nutrient_plant_id_fkey`;

-- DropForeignKey
ALTER TABLE `plantneed` DROP FOREIGN KEY `plantNeed_factor_id_fkey`;

-- DropForeignKey
ALTER TABLE `plantneed` DROP FOREIGN KEY `plantNeed_nutrient_id_fkey`;

-- DropForeignKey
ALTER TABLE `plantneed` DROP FOREIGN KEY `plantNeed_plant_id_fkey`;

-- AlterTable
ALTER TABLE `p_factor` ADD COLUMN `age` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `p_nutrient` ADD COLUMN `age` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `plant` ADD COLUMN `plant_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `otp` INTEGER NULL;

-- DropTable
DROP TABLE `plantneed`;

-- CreateTable
CREATE TABLE `plant_avaliable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plantname` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);

-- AddForeignKey
ALTER TABLE `plant` ADD CONSTRAINT `plant_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `plant_avaliable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p_nutrient` ADD CONSTRAINT `p_nutrient_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `plant_avaliable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p_factor` ADD CONSTRAINT `p_factor_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `plant_avaliable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
