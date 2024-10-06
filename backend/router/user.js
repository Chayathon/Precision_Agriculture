const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { authIsCheck, isAdmin } = require("../middleware/auth");

router.get("/listUser/:role_id", authIsCheck, isAdmin, async (req, res) => {
    const { role_id } = req.params;
    const getUser = await prisma.user.findMany({
        where: {
            role_id: Number(role_id),
        },
        include: {
            role: true,
        },
    });

    if (getUser) {
        res.status(200).json({
            message: "Get User",
            resultData: getUser,
        });
    }
});

router.get("/getUser/:id", async (req, res) => {
    const { id } = req.params;
    const getUser = await prisma.user.findMany({
        where: {
            id: Number(id),
        },
    });

    if (getUser) {
        res.json(getUser);
    }
});

router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const putUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        },
    });
    if (putUser) {
        res.json(putUser);
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delUser = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        if (delUser) {
            res.json(delUser);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;
