const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const verifyRoutes = require('./routes/verify');
const repositoryBankRoutes = require('./routes/repositoryBank');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/claimshield';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Request logger for debug & Review-1 demo tracking
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', verifyRoutes);
app.use('/api', repositoryBankRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'ClaimShield API Gateway',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Root ping
app.get('/', (req, res) => {
  res.send('ClaimShield AI API Gateway is active.');
});

// Connect to MongoDB & Start Server
const startServer = async () => {
  try {
    console.log('[Database] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ [Database] MongoDB Connected successfully.');
  } catch (err) {
    console.warn('⚠️ [Database Warning] MongoDB connection failed:', err.message);
    console.warn('ℹ️ Running in memory/bypass mode. Ensure MongoDB is running locally or Atlas URI is in .env.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 [Server] ClaimShield API Gateway running on http://127.0.0.1:${PORT}`);
    console.log(`📡 [AI Microservice Target] -> ${process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000'}`);
  });
};

startServer();
