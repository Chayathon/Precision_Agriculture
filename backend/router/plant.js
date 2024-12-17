const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { authIsCheck, isAdmin } = require("../middleware/auth");

router.get('/listPlant', async (req, res) => {
    try {
        const listPlant = await prisma.plant.findMany();

        if (listPlant) {
            res.status(200).json({
                message: "Get Plant",
                resultData: listPlant,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.post('/createPlant', async (req, res) => {

    const { plantName, plantAt, userId } = req.body; // ดึงข้อมูล userId จาก body

    if (!plantName || !plantAt || !userId) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    try {
        const plantDate = new Date(plantAt);

        // ตรวจสอบว่า userId เป็นตัวเลข
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'userId ต้องเป็นตัวเลข' });
        }

        const createPlant = await prisma.plant.create({
            data: {
                plantname: plantName,
                plantedAt: plantDate, // บันทึกวันที่
                user_id: userId, // ใช้ userId ที่ได้รับจาก client
            }
        });

        if (createPlant) {
            res.status(200).json({
                message: 'เพิ่มข้อมูลพืชเรียบร้อยแล้ว',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.get("getPlantUserId/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getPlant = await prisma.plant.findMany({
            where: {
                user_id: Number(id),
            },
            select: {
                plantname: true,
            },
        });

        if (getPlant) {
            res.status(200).json({
                message: "Get Plant by ID",
                resultData: getPlant,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.get("/getPlant/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getPlant = await prisma.plant.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (getPlant) {
            res.status(200).json({
                message: "Plant Plant by ID",
                resultData: getPlant,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.put('/updatePlant/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const putPlant = await prisma.plant.update({
            where: {
                id: Number(id)
            },
            data: {
                plantname: req.body.plantName
            },
        });

        if(putPlant) {
            res.status(200).json({
                message: 'Plant updated successfully',
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/deletePlant/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const delPlant = await prisma.plant.delete({
            where: {
                id: Number(id),
            },
        });

        if(delPlant) {
            res.status(200).json({
                message: 'Plant deleted successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.post('/createFactor', async (req, res) => {

    const { ph, temperature, humidity, lightIntensity, salinity, plantId } = req.body;

    console.log(req.body);

    if (!plantId) {
        return res.status(400).json({ message: "Missing plantId" });
    }

    try {
        const createFactor = await prisma.p_factor.create({
            data: {
                pH: parseFloat(ph), // แปลงเป็นตัวเลข
                temperature: parseFloat(temperature), // แปลงเป็นตัวเลข
                humidity: parseFloat(humidity), // แปลงเป็นตัวเลข
                lightIntensity: parseFloat(lightIntensity), // แปลงเป็นตัวเลข
                salinity: parseFloat(salinity), // แปลงเป็นตัวเลข
                plant_id: plantId,  // ใช้ plantId ที่รับมา
            }
        });

        if(createFactor) {
            res.status(200).json({
                message: 'Factor created successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.post('/createNutrient', async (req, res) => {

    const { nitrogen, phosphorus, potassium, plantId } = req.body;

    console.log(req.body);

    if (!plantId) {
        return res.status(400).json({ message: "Missing plantId" });
    }

    try {
        const createNutrient = await prisma.p_nutrient.create({
            data: {
                nitrogen: parseFloat(nitrogen), // แปลงเป็นตัวเลข
                phosphorus: parseFloat(phosphorus), // แปลงเป็นตัวเลข
                potassium: parseFloat(potassium), // แปลงเป็นตัวเลข
                plant_id: plantId,  // ใช้ plantId ที่รับมา
            }
        });

        if(createNutrient) {
            res.status(200).json({
                message: 'Nutrient created successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router