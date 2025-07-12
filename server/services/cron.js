
const cron = require('node-cron');
const fetchJobs = require('./fetchJobs');
const jobQueue = require('../queue');

const FEED_URLS = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://www.higheredjobs.com/rss/articleFeed.cfm'
];

module.exports = function startCronJob() {
  cron.schedule('0 * * * *', async () => {
    for (let url of FEED_URLS) {
      const jobs = await fetchJobs(url);
      if (jobs.length) await jobQueue.add('import', { sourceUrl: url, jobs });
    }
  });
};
