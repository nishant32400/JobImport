
const axios = require('axios');
const xml2js = require('xml2js');

module.exports = async function fetchJobsFromXmlFeed(url) {
  try {
    const response = await axios.get(url);
    const parsed = await xml2js.parseStringPromise(response.data, { explicitArray: false });
    let items = parsed?.rss?.channel?.item || [];
    if (!Array.isArray(items)) items = [items];
    return items.map(job => ({
      jobId: job.guid._ || job.guid,
      title: job.title,
      description: job.description,
      company: job['job:company'] || 'Unknown',
      location: job['job:location'] || 'Remote',
      url: job.link,
      datePosted: new Date(job.pubDate),
      category: job.category || 'general',
      type: job['job:type'] || 'full-time'
    }));
  } catch (err) {
    console.error('Fetch error:', err.message);
    return [];
  }
};
