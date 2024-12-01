const express = require('express');
const router = express.Router();
const { getDevices, updateDevice, addDevice, toggleDevice } = require('../controllers/DeviceController');


router.get('/', getDevices);
router.put('/:id', updateDevice);
router.post('/add', addDevice);
router.post('/toggle', toggleDevice);

module.exports = router;
