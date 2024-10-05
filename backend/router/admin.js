const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { authIsCheck, isAdmin } = require("../middleware/auth");

router.get('/listAdmin', async(req, res) => {
    const { role_id } = req.params;
    const getAdmin = await prisma.user.findMany({
        where: {
            role_id: Number(role_id),
        },
        include: {
            role: true,
        },
    });

    if (getAdmin) {
        res.status(200).json({
            message: "Get Admin",
            resultData: getAdmin,
        });
    }
})

router.get("/listAdmin/:role_id", authIsCheck, isAdmin, async (req, res) => {
    const { role_id } = req.params;
    const getAdmin = await prisma.user.findMany({
      where: {
          role_id: Number(role_id),
      },
      include: {
          role: true,
      },
    });
  
    if (getAdmin) {
        res.status(200).json({
            message: "Get Admin",
            resultData: getAdmin,
        });
    }
  });

module.exports = router