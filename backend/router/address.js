const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/provinces', async (req, res) => {
    try {
        const provinces = await prisma.province.findMany({
            orderBy: {
                name_th: 'asc'
            }
        });

        if(provinces) {
            res.status(200).json({
                message: "List Provinces",
                resultData: provinces
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get('/province/:provinceId/districts' , async (req, res) => {
    const { provinceId } = req.params;

    try {
        const districts = await prisma.district.findMany({
            where: {
                province_id: Number(provinceId),
            },
            orderBy: {
                name_th: 'asc'
            }
        });

        if(districts) {
            res.status(200).json({
                message: "List Districts sorted by Province",
                resultData: districts
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get('/district/:districtId/subdistricts', async (req, res) => {
    const { districtId } = req.params;

    try {
        const subdistricts = await prisma.subdistrict.findMany({
            where: {
                district_id: Number(districtId)
            },
            orderBy: {
                name_th: 'asc'
            }
        });

        if(subdistricts) {
            res.status(200).json({
                message: "List Subdistricts sorted by District",
                resultData: subdistricts
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;