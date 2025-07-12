
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jobRoutes = require('./routes/jobs');
const importRoutes = require('./routes/import');
const queueProcessor = require('./queue/processor');
const cronJob = require('./services/cron');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

global.io = io;

app.use(express.json());
app.use('/api/jobs', jobRoutes);
app.use('/api/imports', importRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error', err));

queueProcessor();
cronJob();

server.listen(process.env.PORT || 5000, () => console.log('Server running'));
