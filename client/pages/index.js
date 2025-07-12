
import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchLogs() {
    const res = await axios.get('/api/imports/logs');
    setLogs(res.data);
  }

  async function triggerImport() {
    setLoading(true);
    await axios.post('/api/jobs/import-now');
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
    const socket = io('http://localhost:5000');
    socket.on('import_log', (newLog) => {
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="items-center text-4xl font-bold text-blue-800">𝑱𝒐𝒃 𝒊𝒎𝒑𝒐𝒓𝒕𝒆𝒓 𝒅𝒂𝒔𝒉𝒃𝒐𝒂𝒓𝒅</h1>
        
        <div className="card overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-center">
            <thead>
              <tr className="table-header">
                <th className="p-2">Time</th>
                <th className="p-2">Source</th>
                <th className="p-2">Total</th>
                <th className="p-2">New</th>
                <th className="p-2">Updated</th>
                <th className="p-2">Failed</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-2">{log.sourceUrl}</td>
                  <td className="p-2">{log.totalFetched}</td>
                  <td className="p-2 text-green-600">{log.newJobs}</td>
                  <td className="p-2 text-yellow-600">{log.updatedJobs}</td>
                  <td className="p-2 text-red-600">{log.failedJobs.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={triggerImport} className="button">
          {loading ? 'Importing...' : 'Run Import Now'}
        </button>
      </div>
    </div>
  );
}
