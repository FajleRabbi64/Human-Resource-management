// Inside your routes folder, create a new file attendance.routes.js
const router = require("express").Router();
const Attendance = require("../models/attendance.model");

// Add a new attendance record
router.post("/", async (req, res) => {
  try {
    const { userId,name, date, month,timeIn,timeOut, totalHrs,status} = req.body;

    // Check if the attendance record for the user and date already exists
    const existingRecord = await Attendance.findOne({ userId, date });
      
    if (existingRecord) {
      return res.status(400).json({ msg: "Attendance record already exists" });
    }

    const attendance = new Attendance({ userId, name, date,month,timeIn,timeOut, totalHrs, status});
    await attendance.save();
    res.json({ msg: "Attendance recorded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance record for a specific user on today's date
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const day = String(today.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;

    const attendance = await Attendance.findOne({ userId, date: formattedDate  });

    if (!attendance) {
      return res.status(404).json({ msg: "Attendance record not found for today" });
    }

    res.json({ attendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing attendance record
router.put("/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    const { date, month, timeIn, timeOut, totalHrs, status } = req.body;

    // Find the attendance record by ID
    const attendanceRecord = await Attendance.findById(recordId);

    if (!attendanceRecord) {
      return res.status(404).json({ msg: "Attendance record not found" });
    }

    // Update the fields
    attendanceRecord.date = date;
    attendanceRecord.month = month;
    attendanceRecord.timeIn = timeIn;
    attendanceRecord.timeOut = timeOut;
    attendanceRecord.totalHrs = totalHrs;
    attendanceRecord.status = status;

    // Save the updated record
    await attendanceRecord.save();

    res.json({ msg: "Attendance record updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
