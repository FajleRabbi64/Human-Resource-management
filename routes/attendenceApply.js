// Inside your routes folder, create a new file attendance.routes.js
const router = require("express").Router();
const AttendanceApply = require("../models/attendenceApply.model");

// Add a new attendance record
router.post("/", async (req, res) => {
  try {
    const {userId, name,role, date,reason} = req.body;

    // Check if the attendance record for the user and date already exists
    const existingRecord = await AttendanceApply.findOne({ userId, date });
      
    if (existingRecord) {
      return res.status(400).json({ msg: "AttendanceApply already exists" });
    }

    const attendanceApply = new AttendanceApply({ userId, name, role, date,reason});
    await attendanceApply.save();
    res.json({ msg: "Attendance Application successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an attendance record by ID
router.delete("/:id", async (req, res) => {
  try {
    const attendanceRecordId = req.params.id;

    // Check if the attendance record exists
    const existingRecord = await AttendanceApply.findById(attendanceRecordId);
    if (!existingRecord) {
      return res.status(404).json({ msg: "Attendance record not found" });
    }

    // Delete the attendance record
    await AttendanceApply.findByIdAndDelete(attendanceRecordId);
    res.json({ msg: "Attendance application deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
