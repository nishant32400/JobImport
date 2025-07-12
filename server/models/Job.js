
const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true },
  title: String,
  description: String,
  company: String,
  location: String,
  url: String,
  datePosted: Date,
  category: String,
  type: String
}, { timestamps: true });
module.exports = mongoose.model('Job', jobSchema);
