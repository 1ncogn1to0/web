// utils/generateotp.js
function generateOTP() {
    // Генерация случайного 6-значного кода
    return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = generateOTP;
