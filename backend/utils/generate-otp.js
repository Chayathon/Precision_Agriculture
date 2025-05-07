const generateAndSendOTP = async (email, prisma, sendOTPEmail) => {
    const generateOTP = Math.floor(100000 + Math.random() * 900000);

    const updatedUser = await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            otp: generateOTP,
        },
    });

    try {
        await sendOTPEmail(email, generateOTP);

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

        return { updatedUser, otp: generateOTP };
    } catch (error) {
        console.error(`Failed to send OTP email to ${email}:`, error);
        throw error;
    }
};

module.exports = { generateAndSendOTP };