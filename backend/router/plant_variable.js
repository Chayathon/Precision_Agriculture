const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/recievedVariable', async (req, res) => {
    try {
        console.log('Received req.body:', req.body);
        
        const { id, temp, water, ph, conduct, lux, ni, po, pt, latitude, longitude } = req.body;

        if (
            !id ||
            temp === undefined ||
            water === undefined ||
            ph === undefined ||
            conduct === undefined ||
            lux === undefined ||
            ni === undefined ||
            po === undefined ||
            pt === undefined
        ) {
            return res.status(400).json({
                message: 'ข้อมูลที่ส่งมาไม่ครบถ้วนหรือไม่ถูกต้อง'
            });
        }

        const parsedData = {
            plant_id: Number(id),
            temperature: parseFloat(temp),
            humidity: parseFloat(water),
            pH: parseFloat(ph),
            salinity: parseFloat(conduct),
            lightIntensity: parseFloat(lux),
            nitrogen: parseFloat(ni),
            phosphorus: parseFloat(po),
            potassium: parseFloat(pt),
        };

        // ตรวจสอบว่าไม่มีค่าใดเป็น NaN
        for (const [key, value] of Object.entries(parsedData)) {
            if (isNaN(value)) {
                return res.status(400).json({
                    message: `ข้อมูล ${key} ไม่ใช่ตัวเลขที่ถูกต้อง`
                });
            }
        }

        const recievedTime = new Date();

        const plantVariable = await prisma.p_variable.create({
            data: {
                ...parsedData,
                receivedAt: recievedTime
            }
        });

        const plant = await prisma.plant.findFirst({
            where: {
                id: Number(id),
                latitude: null,
                longitude: null,
            },
        });

        if (plant) {
            const coordinatesData = await prisma.plant.update({
                where: {
                    id: Number(id),
                },
                data: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                },
            });
        }

        if(plantVariable) {
            res.status(200).json({
                message: 'ส่งข้อมูลพืชเรียบร้อยแล้ว',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getPlantVariable/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const plantVariable = await prisma.p_variable.findMany({
            where: {
                plant_id: Number(id),
            },
            orderBy: {
                receivedAt: 'desc',
            },
            take: 1,
        });

        if(plantVariable) {
            res.status(200).json({
                message: 'Get Plant Variable',
                resultData: plantVariable,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getPlantVariables7day/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const latestRecord = await prisma.p_variable.findFirst({
            where: {
                plant_id: Number(id),
            },
            orderBy: {
                receivedAt: 'desc',
            },
        });

        if (!latestRecord) {
            return res.status(404).json({ message: 'No data found for the last 7 days' });
        }
        
        const latestDate = new Date(latestRecord.receivedAt);
        const Days = new Date(latestDate);
        Days.setDate(latestDate.getDate() - 7);

        // ดึงข้อมูลเฉพาะในช่วง 7 วัน
        const plantVariables = await prisma.p_variable.findMany({
            where: {
                plant_id: Number(id),
                receivedAt: {
                    gte: Days, // มากกว่าหรือเท่ากับ 7 วันก่อน
                    lte: latestDate,   // น้อยกว่าหรือเท่ากับวันที่ล่าสุด
                },
            },
            orderBy: {
                receivedAt: 'asc',
            },
        });

        if (plantVariables.length === 0) {
            return res.status(404).json({ message: 'No data found for the last 7 days' });
        }

        res.status(200).json({
            message: 'Get Plant Variables for the last 7 days',
            resultData: plantVariables,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getPlantVariables14day/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const latestRecord = await prisma.p_variable.findFirst({
            where: {
                plant_id: Number(id),
            },
            orderBy: {
                receivedAt: 'desc',
            },
        });

        if (!latestRecord) {
            return res.status(404).json({ message: 'No data found for the last 14 days' });
        }
        
        const latestDate = new Date(latestRecord.receivedAt);
        const Days = new Date(latestDate);
        Days.setDate(latestDate.getDate() - 14);

        // ดึงข้อมูลเฉพาะในช่วง 14 วัน
        const plantVariables = await prisma.p_variable.findMany({
            where: {
                plant_id: Number(id),
                receivedAt: {
                    gte: Days, // มากกว่าหรือเท่ากับ 14 วันก่อน
                    lte: latestDate,   // น้อยกว่าหรือเท่ากับวันที่ล่าสุด
                },
            },
            orderBy: {
                receivedAt: 'asc',
            },
        });

        if (plantVariables.length === 0) {
            return res.status(404).json({ message: 'No data found for the last 14 days' });
        }

        res.status(200).json({
            message: 'Get Plant Variables for the last 14 days',
            resultData: plantVariables,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getPlantVariables1month/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const latestRecord = await prisma.p_variable.findFirst({
            where: {
                plant_id: Number(id),
            },
            orderBy: {
                receivedAt: 'desc',
            },
        });

        if (!latestRecord) {
            return res.status(404).json({ message: 'No data found for the last 1 month' });
        }
        
        const latestDate = new Date(latestRecord.receivedAt);
        const Days = new Date(latestDate);
        Days.setMonth(latestDate.getMonth() - 1);

        // ดึงข้อมูลเฉพาะในช่วง 1 เดือน
        const plantVariables = await prisma.p_variable.findMany({
            where: {
                plant_id: Number(id),
                receivedAt: {
                    gte: Days, // มากกว่าหรือเท่ากับ 1 เดือนก่อน
                    lte: latestDate,   // น้อยกว่าหรือเท่ากับวันที่ล่าสุด
                },
            },
            orderBy: {
                receivedAt: 'asc',
            },
        });

        if (plantVariables.length === 0) {
            return res.status(404).json({ message: 'No data found for the last 1 month' });
        }

        res.status(200).json({
            message: 'Get Plant Variables for the last 1 month',
            resultData: plantVariables,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getPlantVariables3month/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const latestRecord = await prisma.p_variable.findFirst({
            where: {
                plant_id: Number(id),
            },
            orderBy: {
                receivedAt: 'desc',
            },
        });

        if (!latestRecord) {
            return res.status(404).json({ message: 'No data found for the last 3 months' });
        }
        
        const latestDate = new Date(latestRecord.receivedAt);
        const Days = new Date(latestDate);
        Days.setMonth(latestDate.getMonth() - 3);

        // ดึงข้อมูลเฉพาะในช่วง 3 เดือน
        const plantVariables = await prisma.p_variable.findMany({
            where: {
                plant_id: Number(id),
                receivedAt: {
                    gte: Days, // มากกว่าหรือเท่ากับ 3 เดือนก่อน
                    lte: latestDate,   // น้อยกว่าหรือเท่ากับวันที่ล่าสุด
                },
            },
            orderBy: {
                receivedAt: 'asc',
            },
        });

        if (plantVariables.length === 0) {
            return res.status(404).json({ message: 'No data found for the last 3 month' });
        }

        res.status(200).json({
            message: 'Get Plant Variables for the last 3 month',
            resultData: plantVariables,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getPlantVariables6month/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const latestRecord = await prisma.p_variable.findFirst({
            where: {
                plant_id: Number(id),
            },
            orderBy: {
                receivedAt: 'desc',
            },
        });

        if (!latestRecord) {
            return res.status(404).json({ message: 'No data found for the last 6 months' });
        }
        
        const latestDate = new Date(latestRecord.receivedAt);
        const Days = new Date(latestDate);
        Days.setMonth(latestDate.getMonth() - 6);

        // ดึงข้อมูลเฉพาะในช่วง 6 เดือน
        const plantVariables = await prisma.p_variable.findMany({
            where: {
                plant_id: Number(id),
                receivedAt: {
                    gte: Days, // มากกว่าหรือเท่ากับ 6 เดือนก่อน
                    lte: latestDate,   // น้อยกว่าหรือเท่ากับวันที่ล่าสุด
                },
            },
            orderBy: {
                receivedAt: 'asc',
            },
        });

        if (plantVariables.length === 0) {
            return res.status(404).json({ message: 'No data found for the last 6 month' });
        }

        res.status(200).json({
            message: 'Get Plant Variables for the last 6 month',
            resultData: plantVariables,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getPlantVariables9month/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const latestRecord = await prisma.p_variable.findFirst({
            where: {
                plant_id: Number(id),
            },
            orderBy: {
                receivedAt: 'desc',
            },
        });

        if (!latestRecord) {
            return res.status(404).json({ message: 'No data found for the last 9 months' });
        }
        
        const latestDate = new Date(latestRecord.receivedAt);
        const Days = new Date(latestDate);
        Days.setMonth(latestDate.getMonth() - 9);

        // ดึงข้อมูลเฉพาะในช่วง 9 เดือน
        const plantVariables = await prisma.p_variable.findMany({
            where: {
                plant_id: Number(id),
                receivedAt: {
                    gte: Days, // มากกว่าหรือเท่ากับ 9 เดือนก่อน
                    lte: latestDate,   // น้อยกว่าหรือเท่ากับวันที่ล่าสุด
                },
            },
            orderBy: {
                receivedAt: 'asc',
            },
        });

        if (plantVariables.length === 0) {
            return res.status(404).json({ message: 'No data found for the last 9 month' });
        }

        res.status(200).json({
            message: 'Get Plant Variables for the last 9 month',
            resultData: plantVariables,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getPlantVariables1year/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const latestRecord = await prisma.p_variable.findFirst({
            where: {
                plant_id: Number(id),
            },
            orderBy: {
                receivedAt: 'desc',
            },
        });

        if (!latestRecord) {
            return res.status(404).json({ message: 'No data found for the last 1 year' });
        }
        
        const latestDate = new Date(latestRecord.receivedAt);
        const Days = new Date(latestDate);
        Days.setFullYear(latestDate.getFullYear() - 1);

        // ดึงข้อมูลเฉพาะในช่วง 1 ปี
        const plantVariables = await prisma.p_variable.findMany({
            where: {
                plant_id: Number(id),
                receivedAt: {
                    gte: Days, // มากกว่าหรือเท่ากับ 1 ปีก่อน
                    lte: latestDate,   // น้อยกว่าหรือเท่ากับวันที่ล่าสุด
                },
            },
            orderBy: {
                receivedAt: 'asc',
            },
        });

        if (plantVariables.length === 0) {
            return res.status(404).json({ message: 'No data found for the last 1 year' });
        }

        res.status(200).json({
            message: 'Get Plant Variables for the last 1 year',
            resultData: plantVariables,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;