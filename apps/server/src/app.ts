import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { apiRouter } from './routes/apiRoutes.js';
import { wsServer } from './websocket/wsServer.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Root & Health check
app.get('/', (req, res) => {
  res.json({
    product: 'QAgent — AI-Powered Quality Engineering Platform',
    status: 'healthy',
    version: '1.0.0',
    webUrl: 'http://localhost:5173',
    apiUrl: 'http://localhost:4000/api',
    wsUrl: 'ws://localhost:4000/ws',
    message: 'Backend server is running. Access the web dashboard at http://localhost:5173',
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'QAgent Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    wsClients: wsServer.getConnectedClientsCount(),
  });
});

// Initialize WebSocket server
wsServer.init(server);

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 QAgent Backend API Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/ws`);
  console.log(`✨ Default project: SauceDemo QA Project (ready)`);
  console.log(`====================================================`);
});
