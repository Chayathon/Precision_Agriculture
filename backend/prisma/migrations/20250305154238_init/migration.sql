/*
  Warnings:

  - Added the required column `district` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdistrict` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `district` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `province` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `subdistrict` INTEGER UNSIGNED NOT NULL;

-- CreateTable
CREATE TABLE `province` (
    `province_id` INTEGER UNSIGNED NOT NULL,
    `name_th` VARCHAR(120) NULL,
    `name_en` VARCHAR(120) NULL,

    PRIMARY KEY (`province_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `district` (
    `district_id` INTEGER UNSIGNED NOT NULL,
    `province_id` INTEGER UNSIGNED NOT NULL,
    `name_th` VARCHAR(120) NULL,
    `name_en` VARCHAR(120) NULL,

    INDEX `province_id`(`province_id`),
    PRIMARY KEY (`district_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subdistrict` (
    `subdistrict_id` INTEGER UNSIGNED NOT NULL,
    `district_id` INTEGER UNSIGNED NULL,
    `name_th` VARCHAR(120) NULL,
    `name_en` VARCHAR(120) NULL,
    `lat` DECIMAL(5, 3) NULL,
    `long` DECIMAL(6, 3) NULL,
    `zipcode` MEDIUMINT UNSIGNED NULL,

    INDEX `district_id`(`district_id`),
    PRIMARY KEY (`subdistrict_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `p_other_nutrient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plant_id` INTEGER NOT NULL,
    `age` INTEGER NOT NULL,
    `nitrogen` DOUBLE NOT NULL,
    `phosphorus` DOUBLE NOT NULL,
    `potassium` DOUBLE NOT NULL,

    INDEX `p_other_nutrient_plant_id_fkey`(`plant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `p_other_factor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plant_id` INTEGER NOT NULL,
    `age` INTEGER NOT NULL,
    `pH` DOUBLE NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `salinity` DOUBLE NOT NULL,
    `lightIntensity` DOUBLE NOT NULL,

    INDEX `p_other_factor_plant_id_fkey`(`plant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `user_province_fkey` ON `user`(`province`);

-- CreateIndex
CREATE INDEX `user_district_fkey` ON `user`(`district`);

-- CreateIndex
CREATE INDEX `user_subdistrict_fkey` ON `user`(`subdistrict`);

-- AddForeignKey
ALTER TABLE `district` ADD CONSTRAINT `district_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `province`(`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subdistrict` ADD CONSTRAINT `subdistrict_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `district`(`district_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_province_fkey` FOREIGN KEY (`province`) REFERENCES `province`(`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_district_fkey` FOREIGN KEY (`district`) REFERENCES `district`(`district_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_subdistrict_fkey` FOREIGN KEY (`subdistrict`) REFERENCES `subdistrict`(`subdistrict_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p_other_nutrient` ADD CONSTRAINT `p_other_nutrient_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `plant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p_other_factor` ADD CONSTRAINT `p_other_factor_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `plant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
