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
        subject: 'ยืนยันการสมัครสมาชิก - Precision Agriculture',
        html: `
            <div style="font-family: 'Kanit', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
                <h1 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px; font-family: 'Kanit', Arial, sans-serif;">Precision Agriculture</h1>
                <h2 style="color: #333; font-family: 'Kanit', Arial, sans-serif;">ยืนยันการสมัครสมาชิก Precision Agriculture</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5; font-family: 'Kanit', Arial, sans-serif;">
                    เพื่อให้การสมัครสมาชิกสำเร็จ
                </p>
                <p style="color: #555; font-size: 16px; line-height: 1.5; font-family: 'Kanit', Arial, sans-serif;">
                    กรุณากดปุ่มด้านล่างเพื่อยืนยันการสมัครสมาชิก (ภายใน 1 ชม.)
                </p>
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #28a745; color: #fff; padding: 12px 30px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 10px; font-family: 'Kanit', Arial, sans-serif;">
                        ยืนยันการสมัครสมาชิก
                    </a>
                </div>
                <p style="color: #555; font-size: 14px; line-height: 1.5; font-family: 'Kanit', Arial, sans-serif;">
                    เมื่อคุณสมัครสมาชิกสำเร็จแล้ว สามารถเข้าใช้งานได้ทันที
                </p>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };