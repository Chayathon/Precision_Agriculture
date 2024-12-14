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

module.exports = router