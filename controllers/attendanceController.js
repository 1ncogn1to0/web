const Attendance = require('../models/attendanceModel');

exports.getAllAttendance = async (req, res) => {
    const records = await Attendance.find();
    res.json(records);
};

exports.addAttendance = async (req, res) => {
    const { userId, date, status } = req.body;
    const record = new Attendance({ userId, date, status });
    await record.save();
    res.status(201).json(record);
};