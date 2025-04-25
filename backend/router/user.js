const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");

const { authIsCheck, isAdmin } = require("../middleware/auth");

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

router.get("/forgotPassword/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const getUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (getUser) {
            const generateOTP = Math.floor(100000 + Math.random() * 900000);

            const updatedUser = await prisma.user.update({
                where: {
                    email: email,
                },
                data: {
                    otp: generateOTP,
                },
            });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
            });

            const mailOptions = {
                from: 'Precision Agriculture',
                to: email,
                subject: 'One Time Passcode',
                html: `
                    <h3>รหัส OTP ของคุณ: <u>${generateOTP}</u></h3>
                    <p style="color: red;">
                        <small>*มีอายุการใช้งาน 5 นาที</small>
                    </p>
                `
            }

            await transporter.sendMail(mailOptions);

            // ตั้ง timeout ให้ OTP เป็น null หลัง 5 นาที (300,000 ms)
            setTimeout(async () => {
                try {
                    await prisma.user.update({
                        where: {
                            email: email,
                        },
                        data: {
                            otp: null,
                        },
                    });
                    console.log(`OTP for ${email} has been reset to null`);
                } catch (error) {
                    console.error(`Failed to reset OTP for ${email}:`, error);
                }
            }, 5 * 60 * 1000);

            res.status(200).json({
                message: "Get User by Email, OTP Generated, Send Email",
                resultData: {
                    user: updatedUser,
                    otp: generateOTP,
                },
            });
        } else {
            res.status(404).json({
                message: "User not found",
                resultData: null,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
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

router.put("/updatePassword", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password
    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const updatedPassword = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashPassword,
                otp: null,
            },
        });

        if(updatedPassword) {
            res.status(200).json({
                message: "Password updated successfully"
            });
        } else {
            res.status(401).json({
                message: "Password update failed"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
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