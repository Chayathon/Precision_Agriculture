const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { authIsCheck, isAdmin } = require("../middleware/auth");

const keyauth = "lovemymom";

router.post("/register", async (req, res) => {
    const password = req.body.password
    const hashPassword = await bcrypt.hash(password, 10);

    const checkUser = await prisma.user.findFirst({
        where: {
            email: req.body.email,
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
                username: req.body.username,
                password: hashPassword,
                role_id: 1,
            },
        });

        if (user) {
            res.json("Registered Success");
        }
    } else {
        res.status(400).json({ error: "User already exists" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const isUser = await prisma.user.findFirst({
            where: {
                username,
            },
            include: {
                role: true,
            },
        });

        if (!isUser) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        const isCheckPassword = await bcrypt.compare(password, isUser.password);

        if (isCheckPassword) {
            const { id, password, ...rest } = isUser;
            const token = jwt.sign(
                {
                data: {
                    username: isUser.username,
                    role: isUser.role.role_name,
                    id: isUser.id,
                },
                },
                `${keyauth}`,
                { expiresIn: "24h" }
            );

            res.status(200).json({
                message: "Login Successfully",
                token: token,
                resultData: rest,
                path: rest.role.role_name == "admin" ? "/admin" : "/dashboard",
            });
        } else {
        res.status(400).json({
                message: "Password invalid",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router