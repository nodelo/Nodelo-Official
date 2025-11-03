require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/database');
const { verifyEmailConfig } = require('./utils/email');
const initializeSocket = require('./utils/socketHandler');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

// Initialize Socket.io
initializeSocket(io);

// Make io available to routes via request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connect to MongoDB
connectDB();

// Verify email configuration on startup
verifyEmailConfig();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Next.js default port
  credentials: true
}));

// JSON parser - conditionally skip multipart/form-data
const jsonParser = express.json();
app.use((req, res, next) => {
  // Skip JSON parsing for multipart/form-data (multer will handle it)
  const contentType = req.headers['content-type'] || '';
  if (contentType && contentType.includes('multipart/form-data')) {
    return next();
  }
  // Use JSON parser for other requests
  jsonParser(req, res, next);
});
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Nodelo API',
    status: 'running',
    version: '1.0.0',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Nodelo API Documentation',
  customfavIcon: '/favicon.ico',
}));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/chats', require('./routes/chats'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💬 Socket.io ready for real-time chat`);
});
