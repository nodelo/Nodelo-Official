# Nodelo Backend

Backend server for Nodelo built with Express.js and MongoDB.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nodelo
CORS_ORIGIN=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## Project Structure

```
backend/
├── config/
│   └── database.js      # MongoDB connection configuration
├── models/              # Mongoose models
├── routes/              # API route handlers
├── server.js            # Main server file
└── package.json         # Dependencies and scripts
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## MongoDB Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGODB_URI` in `.env` to `mongodb://localhost:27017/nodelo`

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` with your Atlas connection string
