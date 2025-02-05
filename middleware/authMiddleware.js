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
