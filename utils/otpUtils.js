// utils/otpUtils.js
const crypto = require('crypto');

// Функция для генерации случайного OTP
const generateOtp = () => {
    const otp = crypto.randomInt(100000, 999999);  // Генерация 6-значного числа
    return otp.toString();
};

module.exports = { generateOtp };
