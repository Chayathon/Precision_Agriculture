-- DropForeignKey
ALTER TABLE "p_factor" DROP CONSTRAINT "p_factor_plant_id_fkey";

-- DropForeignKey
ALTER TABLE "p_nutrient" DROP CONSTRAINT "p_nutrient_plant_id_fkey";

-- DropForeignKey
ALTER TABLE "p_other_factor" DROP CONSTRAINT "p_other_factor_plant_id_fkey";

-- DropForeignKey
ALTER TABLE "p_other_nutrient" DROP CONSTRAINT "p_other_nutrient_plant_id_fkey";

-- DropForeignKey
ALTER TABLE "p_variable" DROP CONSTRAINT "p_variable_plant_id_fkey";

-- DropForeignKey
ALTER TABLE "plant" DROP CONSTRAINT "plant_user_id_fkey";

-- AddForeignKey
ALTER TABLE "p_other_nutrient" ADD CONSTRAINT "p_other_nutrient_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_other_factor" ADD CONSTRAINT "p_other_factor_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plant" ADD CONSTRAINT "plant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_nutrient" ADD CONSTRAINT "p_nutrient_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant_available"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_factor" ADD CONSTRAINT "p_factor_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant_available"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_variable" ADD CONSTRAINT "p_variable_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
