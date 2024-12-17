const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/getPlantVariables/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const plantVariables = await prisma.p_variable.findMany({
            where: {
                plant_id: Number(id),
            },
            orderBy: {
                receivedAt: 'desc',
            },
            take: 1,
        });

        if(plantVariables) {
            res.status(200).json({
                message: 'Get Plant Variables',
                resultData: plantVariables,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;