// routes/otp.js
const express = require('express');
const router = express.Router();
const generateOTP = require('../utils/generateotp');
const sendOTP = require('../utils/sendemail');
const User = require('../models/userModel');  // Модель пользователя для проверки email
const OTP = require('../models/otpModel');  // Модель OTP
// Отправка OTP на email
router.post('/send', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь с таким email не найден' });
        }

        const otp = generateOTP();
        await sendOTP(email, otp);

        // Сохраняем OTP в отдельной коллекции OTP
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        res.json({ message: 'OTP отправлен на email' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Верификация OTP
// Верификация OTP на сервере
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Ищем OTP в отдельной коллекции OTP
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(404).json({ error: 'OTP не найден. Запросите новый код.' });
        }

        // Проверяем соответствие OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({ error: 'Неверный OTP код' });
        }

        // Успешная верификация OTP
        res.json({ message: 'OTP успешно подтвержден' });

        // Удаляем OTP после успешной верификации
        await OTP.deleteOne({ email });
    } catch (error) {
        console.error('Ошибка при верификации OTP:', error);
        res.status(500).json({ error: 'Произошла ошибка при верификации OTP' });
    }
});


module.exports = router;