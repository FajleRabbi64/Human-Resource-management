// Inside your models folder, create a new file attendance.model.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {type: String},
  date: { type: Date },
  month: { type: String},
  timeIn: { type: String},
  timeOut: {type: String},
  totalHrs: {type: String},
  status: { type: String, enum: ["present", "absent","Pending"] },
  
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
