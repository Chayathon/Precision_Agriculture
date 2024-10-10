const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

const { authIsCheck, isAdmin } = require("../middleware/auth");

router.get("/listUser/:role_id", authIsCheck, isAdmin, async (req, res) => {
    const { role_id } = req.params;
    const listUser = await prisma.user.findMany({
        where: {
            role_id: Number(role_id),
        },
        include: {
            role: true,
        },
    });

    if (listUser) {
        res.status(200).json({
            message: "Get User",
            resultData: listUser,
        });
    }
});

router.get("/getUser/:id", async (req, res) => {
    const { id } = req.params;
    const getUser = await prisma.user.findFirst({
        where: {
            id: Number(id),
        },
    });

    if (getUser) {
        res.status(200).json({
            message: "Get User by ID",
            resultData: getUser,
        });
    }
});

router.post("/createUser", async (req, res) => {
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
                username: req.body.username,
                password: hashPassword,
                role_id: 1,
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

router.put("/updateUser/:id", async (req, res) => {
    const { id } = req.params;
    const putUser = await prisma.user.update({
        where: {
                id: Number(id)
            },
        data: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            tel: req.body.tel,
            address: req.body.address,
        },
    });

    if (putUser) {
        res.status(200).json({
            message: "User updated successfully",
        });
    }
});

router.delete("/deleteUser/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delUser = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        if (delUser) {
            res.status(200).json({
                message: "User Deleted successfully",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;