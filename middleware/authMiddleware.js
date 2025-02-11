//auth.Middleware
const validateAttendance = (req, res, next) => {
    const { userId, date, status } = req.body;
    if (!userId || !date || !status) {
        return res.status(400).json({ error: 'Missing required fields: userId, date, or status' });
    }
    next();
};

// Использование middleware в маршруте POST
router.post('/', validateAttendance, (req, res) => {
    res.send('Adding a new attendance record');
});

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Необходима авторизация' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decoded.userId, sessionToken: token });
        if (!user) {
            return res.status(401).json({ error: 'Неверный токен' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
    }
};

module.exports = authMiddleware;

