
const { Worker } = require('bullmq');
const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');

module.exports = function () {
  new Worker('job-importer', async job => {
    const { sourceUrl, jobs } = job.data;
    let newJobs = 0, updatedJobs = 0, failed = [];

    for (let item of jobs) {
      try {
        const res = await Job.findOneAndUpdate(
          { jobId: item.jobId }, { $set: item }, { upsert: true, new: true }
        );
        if (res.createdAt.getTime() === res.updatedAt.getTime()) newJobs++;
        else updatedJobs++;
      } catch (err) {
        failed.push({ jobId: item.jobId, reason: err.message });
      }
    }

    const log = await ImportLog.create({
      sourceUrl,
      timestamp: new Date(),
      totalFetched: jobs.length,
      totalImported: newJobs + updatedJobs,
      newJobs,
      updatedJobs,
      failedJobs: failed
    });

    if (global.io) {
      global.io.emit("import_log", log);
    }
  }, {
    connection: { host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null }
  });
};
