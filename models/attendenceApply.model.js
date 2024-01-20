// Inside your models folder, create a new file attendance.model.js
const mongoose = require("mongoose");

const attendanceApplySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: {type: String,required: true},
  role: {type: String,required: true},
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  
  
});

const AttendanceApply = mongoose.model("AttendanceApply", attendanceApplySchema);

module.exports = AttendanceApply;
