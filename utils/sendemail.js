//senemail.js
const nodemailer = require('nodemailer');

async function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'Mail.ru',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP отправлен на email: ${email}`);
    } catch (error) {
        console.error('Ошибка при отправке OTP:', error);
        throw new Error('Не удалось отправить OTP на email');
    }
}

module.exports = sendOTP;