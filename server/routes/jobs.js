
const express = require('express');
const router = express.Router();
const fetchJobs = require('../services/fetchJobs');
const jobQueue = require('../queue');

const FEED_URLS = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://www.higheredjobs.com/rss/articleFeed.cfm'
];

router.post('/import-now', async (req, res) => {
  try {
    for (let url of FEED_URLS) {
      const jobs = await fetchJobs(url);
      if (jobs.length) await jobQueue.add('import', { sourceUrl: url, jobs });
    }
    res.json({ message: 'Jobs queued' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
module.exports = router;
