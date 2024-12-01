require('dotenv').config(); // Đọc các biến môi trường từ file .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();

// Middleware
app.use(cors()); // Cho phép CORS để hỗ trợ kết nối từ frontend
app.use(express.json()); // Để express có thể hiểu dữ liệu JSON trong body của request

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes); // Đăng ký route cho người dùng
app.use('/api/devices', deviceRoutes); // Đăng ký route cho thiết bị

// Khởi động server
const PORT = process.env.PORT || 5000; // Cổng mặc định là 5000, nếu có trong .env thì sử dụng cổng đó
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
