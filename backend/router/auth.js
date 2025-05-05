const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keyauth = "lovemymom";

const { sendVerificationEmail } = require("../utils/verify-email");
const { sendOTPEmail } = require("../utils/otp-email");

router.post("/register", async (req, res) => {
    const { firstname, lastname, email, tel, address, province, district, subdistrict, username, password } = req.body;

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
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
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
                verificationToken: token,
                isVerified: false,
            },
        });

        await sendVerificationEmail(email, token);

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
            return res.status(403).json({
                message: 'Please verify your email before logging in',
                email: user.email,
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
                path: rest.role.id == 1 ? "/home" : "/admin",
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

router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
  
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }
    
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await prisma.user.update({
            where: {
                email
            },
            data: {
                verificationToken: token
            },
        });
    
        await sendVerificationEmail(email, token);
        
        res.status(200).json({ message: 'Verification email resent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post("/forgotPassword/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const generateOTP = Math.floor(100000 + Math.random() * 900000);

        const updatedUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                otp: generateOTP,
            },
        });

        await sendOTPEmail(email, generateOTP);

        res.status(200).json({
            message: "Get User by Email, OTP Generated, Send Email",
            resultData: {
                user: updatedUser,
                otp: generateOTP,
            },
        });

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
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
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

module.exports = router;