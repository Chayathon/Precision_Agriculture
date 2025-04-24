const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

const { authIsCheck, isAdmin } = require("../middleware/auth");

router.get("/listAdmin/:role_id/:id", authIsCheck, isAdmin, async (req, res) => {
    const { role_id, id } = req.params;

    try {
        const listAdmin = await prisma.user.findMany({
            where: {
                role_id: {
                    gte: Number(role_id),
                },
                id: {
                    not: Number(id),
                },
            },
            include: {
                role: true,
                provinceRel: true, // ดึงข้อมูลจาก province
                districtRel: true, // ดึงข้อมูลจาก district
                subdistrictRel: true, // ดึงข้อมูลจาก subdistrict
            },
        });
      
        if (listAdmin) {
            res.status(200).json({
                message: "Get Admin",
                resultData: listAdmin,
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.post("/createAdmin", async (req, res) => {
    const { firstname, lastname, email, tel, address, province, district, subdistrict, username, password } = req.body;

    try {
        const hashPassword = await bcrypt.hash(password, 10);

        const checkUser = await prisma.user.findFirst({
            where: {
                OR : [
                    { email: email },
                    { username: username}
                ]
            },
        });

        if (!checkUser) {
            const user = await prisma.user.create({
                data: {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    tel: tel,
                    address: address,
                    province: Number(province),
                    district: Number(district),
                    subdistrict: Number(subdistrict),
                    username: username,
                    password: hashPassword,
                    role_id: 2,
                    isVerified: true,
                },
            });

            if (user) {
                res.status(200).json({
                    message: 'User created successfully',
                })
            }
        }
        else {
            res.status(400).json({ error: "User already exists" });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
    
});

module.exports = router;