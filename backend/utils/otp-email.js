const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

const sendOTPEmail = async (email, generateOTP) => {
    const mailOptions = {
        from: 'Precision Agriculture',
        to: email,
        subject: 'ลืมรหัสผ่าน - Precision Agriculture',
        html: `
            <div style="font-family: 'Kanit', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
                <h1 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px; font-family: 'Kanit', Arial, sans-serif;">Precision Agriculture</h1>
                <h2 style="color: #333; font-family: 'Kanit', Arial, sans-serif;">One Time Passcode</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5; font-family: 'Kanit', Arial, sans-serif;">
                    กรุณากรอก "รหัสยืนยัน" ด้านล่างในเว็บบราวเซอร์ของคุณ
                </p>
                <p style="color: #555; font-size: 16px; line-height: 1.5; font-family: 'Kanit', Arial, sans-serif;">
                    เพื่อทำการเปลี่ยนรหัสผ่านใหม่ (ภายใน 5 นาที)
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <h1 style="color: #28a745;">${generateOTP}</h1>
                </div>
                <p style="color: #555; font-size: 14px; line-height: 1.5; font-family: 'Kanit', Arial, sans-serif;">
                    เมื่อคุณกรอกรหัสยืนยันแล้ว จะสามารถเปลี่ยนรหัสผ่านใหม่ได้
                </p>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };