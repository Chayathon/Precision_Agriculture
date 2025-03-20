const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require("bcrypt");

const { authIsCheck, isAdmin } = require("../middleware/auth");

router.get("/listAdmin/:role_id", authIsCheck, isAdmin, async (req, res) => {
    const { role_id } = req.params;
    const listAdmin = await prisma.user.findMany({
        where: {
            role_id: Number(role_id),
        },
        include: {
            role: true,
        },
    });
  
    if (listAdmin) {
        res.status(200).json({
            message: "Get Admin",
            resultData: listAdmin,
        });
    }
});

router.post("/createAdmin", async (req, res) => {
    const password = req.body.password
    const hashPassword = await bcrypt.hash(password, 10);

    const checkUser = await prisma.user.findFirst({
        where: {
            OR : [
                { email: req.body.email },
                { username: req.body.username}
            ]
        },
    });

    if (!checkUser) {
        const user = await prisma.user.create({
            data: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                tel: req.body.tel,
                address: req.body.address,
                province: Number(req.body.province),
                district: Number(req.body.district),
                subdistrict: Number(req.body.subdistrict),
                username: req.body.username,
                password: hashPassword,
                role_id: 2,
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
});

module.exports = router