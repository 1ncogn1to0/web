// app.js
const express = require('express');
require('dotenv').config(); // Загрузка переменных из .env
const connectDB = require('./config/db');
const attendanceRoutes = require('./routes/attendance');
const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otp');   
const path = require('path');
const cors = require('cors');  // Импортируем cors
const generateOTP = require('./utils/generateotp');  
const sendOTP = require('./utils/sendemail');  
const OTP = require('./models/otpModel');

connectDB(); // Подключение к базе данных
const app = express();

// Добавляем middleware для CORS, чтобы разрешить доступ с других доменов
app.use(cors());

// Оставшиеся middleware и маршруты
app.use(express.json()); // Middleware для обработки JSON
app.use('/attendance', attendanceRoutes); // Маршруты посещаемости
app.use('/api/auth', authRoutes); // Маршруты авторизации
app.use('/api/otp', otpRoutes);   // Подключаем маршруты OTP

// Отправка OTP
app.post('/api/otp/send', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();  // Генерируем OTP

    try {
        await sendOTP(email, otp);  // Отправляем OTP на email

        // Сохраняем OTP в базе
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        console.log(`OTP отправлен на email: ${email}`);
        res.json({ message: 'OTP отправлен' });
    } catch (emailError) {
        console.error('Ошибка при отправке OTP:', emailError);
        return res.status(500).json({ error: 'Не удалось отправить OTP на email' });
    }
});

// Подключение папки public
app.use(express.static(path.join(__dirname, '/public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
