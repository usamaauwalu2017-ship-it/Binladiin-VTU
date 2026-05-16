const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'BINLADIIN II VTU API RUNNING',
    version: '1.0.0',
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/airtime', require('./routes/airtimeRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ BINLADIIN II VTU Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`\n🔗 Available Endpoints:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/wallet/balance`);
  console.log(`   POST   /api/wallet/fund`);
  console.log(`   GET    /api/wallet/transactions`);
  console.log(`   POST   /api/data/buy`);
  console.log(`   GET    /api/data/plans`);
  console.log(`   POST   /api/airtime/buy\n`);
});
