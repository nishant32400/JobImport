
const express = require('express');
const router = express.Router();
const ImportLog = require('../models/ImportLog');
router.get('/logs', async (req, res) => {
  const logs = await ImportLog.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});
module.exports = router;
