const Device = require('../models/Device');
const axios = require('axios');

// Thêm thiết bị mới
exports.addDevice = async (req, res) => {
  const { name, type, status } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  try {
    const newDevice = new Device({ name, type, status });
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    console.error('Error adding device:', error);
    res.status(500).json({ message: 'Error adding device', error: error.message });
  }
};

// Lấy danh sách thiết bị
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trạng thái thiết bị
exports.updateDevice = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (typeof status !== 'boolean') {
    return res.status(400).json({ message: 'Status must be a boolean' });
  }

  try {
    const updatedDevice = await Device.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json(updatedDevice);
  } catch (err) {
    console.error('Error updating device:', err);
    res.status(500).json({ error: err.message });
  }
};

// Bật/Tắt thiết bị và gửi yêu cầu tới ESP32
exports.toggleDevice = async (req, res) => {
  const { deviceId, status } = req.body;

  if (typeof status !== 'boolean') {
    return res.status(400).json({ message: 'Status must be a boolean' });
  }

  try {
    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Cập nhật trạng thái thiết bị trong database
    device.status = status;
    await device.save();

    // Gửi yêu cầu tới ESP32 để bật/tắt thiết bị
    const esp32Url = `http://192.168.20.246/led/${status ? 'on' : 'off'}`;  // Điều chỉnh URL theo IP và lệnh ESP32

    try {
      await axios.get(esp32Url);
    } catch (esp32Error) {
      console.error('Error communicating with ESP32:', esp32Error);
      return res.status(500).json({ message: 'Error communicating with ESP32', error: esp32Error.message });
    }

    res.status(200).json({ message: `Device ${status ? 'on' : 'off'} successfully`, device });

  } catch (error) {
    console.error('Error toggling device:', error);
    res.status(500).json({ message: 'Error toggling device', error: error.message });
  }
};
