// models/Device.js
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },  // Loại thiết bị (ví dụ: LED, quạt, etc.)
  status: { type: Boolean, default: false }, // Trạng thái thiết bị (bật/tắt)
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
