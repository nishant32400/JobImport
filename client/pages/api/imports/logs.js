
import axios from 'axios';
export default async function handler(req, res) {
  const r = await axios.get('http://localhost:5000/api/imports/logs');
  res.status(200).json(r.data);
}
