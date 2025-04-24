/*
  Warnings:

  - Added the required column `user_id` to the `plant_avaliable` table without a default value. This is not possible if the table is not empty.
  - Made the column `district_id` on table `subdistrict` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `subdistrict` DROP FOREIGN KEY `subdistrict_district_id_fkey`;

-- AlterTable
ALTER TABLE `plant_avaliable` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `subdistrict` MODIFY `district_id` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verificationToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `plant_avaliable_user_id_fkey` ON `plant_avaliable`(`user_id`);

-- AddForeignKey
ALTER TABLE `subdistrict` ADD CONSTRAINT `subdistrict_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `district`(`district_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plant_avaliable` ADD CONSTRAINT `plant_avaliable_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
