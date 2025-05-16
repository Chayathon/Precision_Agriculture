const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/listPlant/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const listPlant = await prisma.plant.findMany({
            where: {
                user_id: Number(id),
            }
        });

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

router.get('/listPlantAvaliable', async (req, res) => {
    try {
        const listPlantAvaliable = await prisma.plant_avaliable.findMany({
            include: {
                user: true,
            }
        });

        if (listPlantAvaliable) {
            res.status(200).json({
                message: "Get Plant Avaliable",
                resultData: listPlantAvaliable,
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
                plantedAt: true,
                plantname: true,
                latitude: true,
                longitude: true,
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

router.get("/getPlantAvaliableById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getPlant = await prisma.plant_avaliable.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (getPlant) {
            res.status(200).json({
                message: "Get Plant Avaliable by ID",
                resultData: getPlant,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.post('/createPlant', async (req, res) => {

    const { plantName, plantAt, plantId, userId } = req.body;

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
                plant_avaliable_id: Number(plantId),
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

router.post('/createPlantAvaliable', async (req, res) => {

    const { plantName, id } = req.body;

    if (!plantName) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    try {
        const createPlant = await prisma.plant_avaliable.create({
            data: {
                plantname: plantName,
                user_id: id,
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

router.put('/updatePlant/:id', async (req, res) => {
    const { id } = req.params;
    const { plantName, plantAt, plantId } = req.body;

    try {
        const plantDate = new Date(plantAt);

        const putPlant = await prisma.plant.update({
            where: {
                id: Number(id)
            },
            data: {
                plantname: plantName,
                plantedAt: plantDate,
                plant_avaliable_id: plantId
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

router.put('/updatePlantAvaliable/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const putPlant = await prisma.plant_avaliable.update({
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

router.delete('/deletePlantAvaliable/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const delPlantAvaliable = await prisma.plant_avaliable.delete({
            where: {
                id: Number(id),
            },
        });

        if(delPlantAvaliable) {
            res.status(200).json({
                message: 'Plant and related data deleted successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;