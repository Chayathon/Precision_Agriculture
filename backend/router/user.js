const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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