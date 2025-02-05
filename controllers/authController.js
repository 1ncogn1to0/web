// controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const generateOTP = require('../utils/generateotp');  // Подключаем функцию генерации OTP
const sendOTP = require('../utils/sendemail');  // Подключаем функцию отправки OTP на email

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Проверяем, есть ли уже пользователь с таким именем
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }

        // Генерация OTP для двухфакторной аутентификации
        const otp = generateOTP();

        // Сохраняем OTP в базе данных
        const user = new User({ username, password, email, otp });
        await user.save();

        // Отправка OTP на email пользователя
        try {
            await sendOTP(email, otp);
            console.log('OTP отправлен на email: ${email}');
            res.status(201).json({ message: 'Пользователь успешно зарегистрирован. OTP отправлен на ваш email.' });
        } catch (emailError) {
            console.error('Ошибка при отправке OTP:', emailError);
            return res.status(500).json({ error: 'Не удалось отправить OTP на email' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Сравниваем хэш пароля с введённым паролем
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        // Генерация OTP (если нужно)
        const otp = generateOTP();  // Генерация OTP для двухфакторной аутентификации
        user.otp = otp;  // Сохраняем OTP в базу данных
        await user.save();  // Сохраняем изменения

        // Отправка OTP на email пользователя
        try {
            await sendOTP(user.email, otp);
            console.log(`OTP отправлен на email: ${user.email}`);
            res.status(200).json({ 
                message: 'OTP отправлен на ваш email',
                email: user.email  // Возвращаем email в ответе
            });
        } catch (emailError) {
            console.error('Ошибка при отправке OTP:', emailError);
            return res.status(500).json({ error: 'Не удалось отправить OTP на email' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.verifyOTP = async (req, res) => {
    const { otp, email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Неверный OTP код' });
        }

        // Успешная верификация OTP
        res.json({ message: 'OTP успешно подтвержден' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 