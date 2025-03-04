const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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

    const { plantName, plantAt, plantId, userId } = req.body; // ดึงข้อมูล userId จาก body

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
                plant_id: Number(plantId),
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

router.get("/getPlantUserId/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getPlantUserId = await prisma.plant.findMany({
            where: {
                user_id: Number(id),
            },
            select: {
                id: true,
                plantname: true,
            },
        });

        if (getPlantUserId) {
            res.status(200).json({
                message: "Get Plant by UserID",
                resultData: getPlantUserId,
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
                message: "Get Plant by ID",
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

router.get('/getPlantAvaliable', async (req, res) => {
    try {
        const getPlantAvaliable = await prisma.plant_avaliable.findMany();

        if (getPlantAvaliable) {
            res.status(200).json({
                message: "Get Plant Avaliable",
                resultData: getPlantAvaliable,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
})

router.post('/createFactor', async (req, res) => {

    const { age, ph, temperature, humidity, salinity, lightIntensity, plantId } = req.body;

    console.log(req.body);

    if (!plantId) {
        return res.status(400).json({ message: "Missing plantId" });
    }

    try {
        const createFactor = await prisma.p_other_factor.create({
            data: {
                age: Number(age),
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

    const { age, nitrogen, phosphorus, potassium, plantId } = req.body;

    console.log(req.body);

    if (!plantId) {
        return res.status(400).json({ message: "Missing plantId" });
    }

    try {
        const createNutrient = await prisma.p_other_nutrient.create({
            data: {
                age: Number(age),
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

router.get('/getNutrient/:id/:age', async (req, res) => {
    try {
        const { id, age } = req.params;

        const Nutrient = await prisma.p_nutrient.findFirst({
            where: {
                plant_id: Number(id),
                age: {
                    lte: Number(age)
                }
            },
            orderBy: {
                age: 'desc'
            }
        });

        if(Nutrient) {
            res.status(200).json({
                message: 'Get Nutrient Variables',
                resultData: [Nutrient],
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getFactor/:id/:age', async (req, res) => {
    try {
        const { id, age } = req.params;

        const Factor = await prisma.p_factor.findFirst({
            where: {
                plant_id: Number(id),
                age: {
                    lte: Number(age)
                }
            },
            orderBy: {
                age: 'desc'
            }
        });

        if(Factor) {
            res.status(200).json({
                message: 'Get Factor Variables',
                resultData: [Factor],
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getOtherNutrient/:id/:age', async (req, res) => {
    try {
        const { id, age } = req.params;

        const Nutrient = await prisma.p_other_nutrient.findFirst({
            where: {
                plant_id: Number(id),
                age: {
                    lte: Number(age)
                }
            },
            orderBy: {
                age: 'desc'
            }
        });

        if(Nutrient) {
            res.status(200).json({
                message: 'Get Nutrient Variables',
                resultData: [Nutrient],
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getOtherFactor/:id/:age', async (req, res) => {
    try {
        const { id, age } = req.params;

        const Factor = await prisma.p_other_factor.findFirst({
            where: {
                plant_id: Number(id),
                age: {
                    lte: Number(age)
                }
            },
            orderBy: {
                age: 'desc'
            }
        });

        if(Factor) {
            res.status(200).json({
                message: 'Get Factor Variables',
                resultData: [Factor],
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router