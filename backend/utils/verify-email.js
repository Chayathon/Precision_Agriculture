const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const mailOptions = {
        from: 'Precision Agriculture',
        to: email,
        subject: 'ยืนยันที่อยู่อีเมลของคุณ',
        html: `<h3><a href="${verificationUrl}">ยืนยันที่อยู่อีเมล</a></h3>`
    };
    
    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };