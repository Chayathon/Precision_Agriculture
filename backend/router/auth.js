const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const keyauth = "lovemymom";

router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    try {
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

        const hashPassword = await bcrypt.hash(password, 10);

        // สร้าง Verification Token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
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
                verificationToken: token,
                isVerified: false,
            },
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const mailOptions = {
            from: 'Precision Agriculture',
            to: email,
            subject: 'ยืนยันที่อยู่อีเมลของคุณ',
            html: `
                <h3>ยืนยันอีเมลโดยการคลิก <a href="${verificationUrl}">ที่นี่</a></h3>
                <p style="color: red;">
                    <small>*มีอายุการใช้งาน 1 ชั่วโมง</small>
                </p>
            `
        }

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User registered. Please check your email to verify.' });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
  
    try {
        // ตรวจสอบ token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;
    
        // ค้นหาผู้ใช้
        const user = await prisma.user.findFirst({
            where: { email, verificationToken: token },
        });
    
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
    
        // อัปเดตสถานะการยืนยัน
        await prisma.user.update({
            where: {
                email
            },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });
    
        res.status(200).json({
            message: 'Email verified successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: 'Invalid or expired token', error
        });
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

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
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