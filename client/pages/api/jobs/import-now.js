
import axios from 'axios';
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const r = await axios.post('http://localhost:5000/api/jobs/import-now');
    res.status(200).json(r.data);
  } else {
    res.status(405).end();
  }
}
