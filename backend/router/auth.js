const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const keyauth = "lovemymom";

router.post("/register", async (req, res) => {
    try {
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
                    role_id: 1,
                },
            });

            if (user) {
                res.status(200).json({
                    message: "Registered Success"
                });
            }
        }
        else {
            res.status(400).json({
                message: "User already exists"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "กรุณาระบุชื่อผู้ใช้และรหัสผ่าน",
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                username,
            },
            include: {
                role: true,
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            const { password, ...rest } = user;
            const token = jwt.sign(
                {
                    data: {
                        username: user.username,
                        role: user.role.role_name,
                        id: user.id,
                    },
                },
                `${keyauth}`,
                { expiresIn: "24h" }
            );

            res.status(200).json({
                message: "Login Successfully",
                token: token,
                resultData: rest,
                path: rest.role.role_name == "admin" ? "/admin" : "/home",
            });
        }
        else {
            res.status(401).json({
                message: "Password invalid",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;