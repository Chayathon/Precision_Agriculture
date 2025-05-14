-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "province" (
    "province_id" INTEGER NOT NULL,
    "name_th" VARCHAR(120),
    "name_en" VARCHAR(120),

    CONSTRAINT "province_pkey" PRIMARY KEY ("province_id")
);

-- CreateTable
CREATE TABLE "district" (
    "district_id" INTEGER NOT NULL,
    "province_id" INTEGER NOT NULL,
    "name_th" VARCHAR(120),
    "name_en" VARCHAR(120),

    CONSTRAINT "district_pkey" PRIMARY KEY ("district_id")
);

-- CreateTable
CREATE TABLE "subdistrict" (
    "subdistrict_id" INTEGER NOT NULL,
    "district_id" INTEGER NOT NULL,
    "name_th" VARCHAR(120),
    "name_en" VARCHAR(120),
    "lat" DECIMAL(9,6),
    "long" DECIMAL(9,6),
    "zipcode" INTEGER,

    CONSTRAINT "subdistrict_pkey" PRIMARY KEY ("subdistrict_id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "province" INTEGER NOT NULL,
    "district" INTEGER NOT NULL,
    "subdistrict" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "otp" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plant_available" (
    "id" SERIAL NOT NULL,
    "plantname" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "plant_available_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_other_nutrient" (
    "id" SERIAL NOT NULL,
    "plant_id" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "nitrogen" DOUBLE PRECISION NOT NULL,
    "phosphorus" DOUBLE PRECISION NOT NULL,
    "potassium" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "p_other_nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_other_factor" (
    "id" SERIAL NOT NULL,
    "plant_id" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "pH" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "salinity" DOUBLE PRECISION NOT NULL,
    "lightIntensity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "p_other_factor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plant" (
    "id" SERIAL NOT NULL,
    "plantname" TEXT NOT NULL,
    "plantedAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "user_id" INTEGER NOT NULL,
    "plant_avaliable_id" INTEGER NOT NULL,

    CONSTRAINT "plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_nutrient" (
    "id" SERIAL NOT NULL,
    "nitrogen" DOUBLE PRECISION NOT NULL,
    "phosphorus" DOUBLE PRECISION NOT NULL,
    "potassium" DOUBLE PRECISION NOT NULL,
    "plant_id" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "p_nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_factor" (
    "id" SERIAL NOT NULL,
    "pH" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "lightIntensity" DOUBLE PRECISION NOT NULL,
    "salinity" DOUBLE PRECISION NOT NULL,
    "plant_id" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "p_factor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_variable" (
    "id" SERIAL NOT NULL,
    "plant_id" INTEGER NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nitrogen" DOUBLE PRECISION NOT NULL,
    "phosphorus" DOUBLE PRECISION NOT NULL,
    "potassium" DOUBLE PRECISION NOT NULL,
    "pH" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "lightIntensity" DOUBLE PRECISION NOT NULL,
    "salinity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "p_variable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "district_province_id_idx" ON "district"("province_id");

-- CreateIndex
CREATE INDEX "subdistrict_district_id_idx" ON "subdistrict"("district_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_id_idx" ON "user"("role_id");

-- CreateIndex
CREATE INDEX "user_province_idx" ON "user"("province");

-- CreateIndex
CREATE INDEX "user_district_idx" ON "user"("district");

-- CreateIndex
CREATE INDEX "user_subdistrict_idx" ON "user"("subdistrict");

-- CreateIndex
CREATE INDEX "plant_available_user_id_idx" ON "plant_available"("user_id");

-- CreateIndex
CREATE INDEX "p_other_nutrient_plant_id_idx" ON "p_other_nutrient"("plant_id");

-- CreateIndex
CREATE INDEX "p_other_factor_plant_id_idx" ON "p_other_factor"("plant_id");

-- CreateIndex
CREATE INDEX "plant_plant_avaliable_id_idx" ON "plant"("plant_avaliable_id");

-- CreateIndex
CREATE INDEX "plant_user_id_idx" ON "plant"("user_id");

-- CreateIndex
CREATE INDEX "p_nutrient_plant_id_idx" ON "p_nutrient"("plant_id");

-- CreateIndex
CREATE INDEX "p_factor_plant_id_idx" ON "p_factor"("plant_id");

-- CreateIndex
CREATE INDEX "p_variable_plant_id_idx" ON "p_variable"("plant_id");

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "province"("province_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subdistrict" ADD CONSTRAINT "subdistrict_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("district_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_district_fkey" FOREIGN KEY ("district") REFERENCES "district"("district_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_province_fkey" FOREIGN KEY ("province") REFERENCES "province"("province_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_subdistrict_fkey" FOREIGN KEY ("subdistrict") REFERENCES "subdistrict"("subdistrict_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plant_available" ADD CONSTRAINT "plant_available_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_other_nutrient" ADD CONSTRAINT "p_other_nutrient_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_other_factor" ADD CONSTRAINT "p_other_factor_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plant" ADD CONSTRAINT "plant_plant_avaliable_id_fkey" FOREIGN KEY ("plant_avaliable_id") REFERENCES "plant_available"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plant" ADD CONSTRAINT "plant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_nutrient" ADD CONSTRAINT "p_nutrient_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant_available"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_factor" ADD CONSTRAINT "p_factor_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant_available"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_variable" ADD CONSTRAINT "p_variable_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
