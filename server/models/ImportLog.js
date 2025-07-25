
const mongoose = require('mongoose');
const importLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  sourceUrl: String,
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [{ jobId: String, reason: String }]
});
module.exports = mongoose.model('ImportLog', importLogSchema);
