const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

const { authIsCheck, isAdmin } = require("../middleware/auth");

router.get("/listUsers/:role_id", authIsCheck, isAdmin, async (req, res) => {
    const { role_id } = req.params;
    
    try {
        const listUsers = await prisma.user.findMany({
            where: {
                role_id: Number(role_id),
                isVerified: true,
            },
            include: {
                role: true,
            },
        });
    
        if (listUsers) {
            res.status(200).json({
                message: "Get All User",
                resultData: listUsers,
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get("/listUser/:role_id/:verified", authIsCheck, isAdmin, async (req, res) => {
    const { role_id, verified } = req.params;
    
    try {
        const isVerified = verified === "1" ? true : false;

        const listUser = await prisma.user.findMany({
            where: {
                role_id: Number(role_id),
                isVerified: isVerified,
            },
            include: {
                role: true,
                provinceRel: true, // ดึงข้อมูลจาก province
                districtRel: true, // ดึงข้อมูลจาก district
                subdistrictRel: true, // ดึงข้อมูลจาก subdistrict
            },
        });
    
        if (listUser) {
            res.status(200).json({
                message: "Get User",
                resultData: listUser,
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get("/getUser/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const getUser = await prisma.user.findFirst({
            where: {
                id: Number(id),
            },
            include: {
                provinceRel: true, // ดึงข้อมูลจาก province
                districtRel: true, // ดึงข้อมูลจาก district
                subdistrictRel: true, // ดึงข้อมูลจาก subdistrict
            },
        });
    
        if (getUser) {
            res.status(200).json({
                message: "Get User by ID",
                resultData: getUser,
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get("/getUsername/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const getUsername = await prisma.user.findFirst({
            where: {
                id: Number(id),
            },
            select: {
                username: true,
            }
        });
    
        if (getUsername) {
            res.status(200).json({
                message: "Get Username by ID",
                resultData: getUsername,
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.post("/createUser", async (req, res) => {
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

        if(checkUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
    
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
                role_id: 1,
                isVerified: true,
            },
        });

        if (user) {
            res.status(200).json({
                message: 'User created successfully',
            })
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.put("/updateUser/:id", async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, tel, address, role, province, district, subdistrict } = req.body;

    try {
        const putUser = await prisma.user.update({
            where: {
                    id: Number(id)
                },
            data: {
                firstname: firstname,
                lastname: lastname,
                email: email,
                tel: tel,
                address: address,
                role_id: Number(role),
                province: Number(province),
                district: Number(district),
                subdistrict: Number(subdistrict),
            },
        });
    
        if (putUser) {
            res.status(200).json({
                message: "User updated successfully",
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
    
});

router.delete("/deleteUser/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
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