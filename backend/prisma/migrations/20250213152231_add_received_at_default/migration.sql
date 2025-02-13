-- CreateTable
CREATE TABLE `plant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plantname` VARCHAR(191) NOT NULL,
    `plantedAt` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `p_nutrient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nitrogen` DOUBLE NOT NULL,
    `phosphorus` DOUBLE NOT NULL,
    `potassium` DOUBLE NOT NULL,
    `plant_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `p_factor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pH` DOUBLE NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `lightIntensity` DOUBLE NOT NULL,
    `salinity` DOUBLE NOT NULL,
    `plant_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `p_variable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plant_id` INTEGER NOT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nitrogen` DOUBLE NOT NULL,
    `phosphorus` DOUBLE NOT NULL,
    `potassium` DOUBLE NOT NULL,
    `pH` DOUBLE NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `lightIntensity` DOUBLE NOT NULL,
    `salinity` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plantNeed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plant_id` INTEGER NOT NULL,
    `nutrient_id` INTEGER NOT NULL,
    `factor_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `plant` ADD CONSTRAINT `plant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p_nutrient` ADD CONSTRAINT `p_nutrient_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `plant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p_factor` ADD CONSTRAINT `p_factor_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `plant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p_variable` ADD CONSTRAINT `p_variable_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `plant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plantNeed` ADD CONSTRAINT `plantNeed_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `plant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plantNeed` ADD CONSTRAINT `plantNeed_nutrient_id_fkey` FOREIGN KEY (`nutrient_id`) REFERENCES `p_nutrient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plantNeed` ADD CONSTRAINT `plantNeed_factor_id_fkey` FOREIGN KEY (`factor_id`) REFERENCES `p_factor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
