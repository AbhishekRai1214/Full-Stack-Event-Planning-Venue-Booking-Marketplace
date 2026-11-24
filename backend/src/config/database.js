/**
 * MongoDB Database Connection
 *
 * WHY this module:
 * - Centralizes all database connection logic
 * - Handles connection events (disconnect, error, reconnect)
 * - Implements graceful shutdown support
 * - Logs connection status clearly
 *
 * TRANSACTION SUPPORT NOTE:
 * MongoDB transactions require a Replica Set.
 * - Local dev: mongod --replSet rs0 OR use docker-compose.yml
 * - Production: MongoDB Atlas (always replica set)
 * - Standalone mongod: transactions NOT supported
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected) {
    logger.debug('Using existing database connection');
    return;
  }

  // Read URI after dotenv has been configured
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.error('MONGODB_URI is not set. Cannot connect to database.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      // These are the recommended options for production
      maxPoolSize: 10, // Connection pool: up to 10 simultaneous connections
      serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB isn't reachable
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    isConnected = true;
    logger.info(
      { host: conn.connection.host, db: conn.connection.name },
      '✅ MongoDB connected successfully'
    );
  } catch (error) {
    logger.error({ err: error }, '❌ Failed to connect to MongoDB');
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('MongoDB disconnected. Mongoose will attempt to reconnect automatically.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  logger.info('MongoDB reconnected');
});

mongoose.connection.on('error', err => {
  logger.error({ err }, 'MongoDB connection error');
});

// Close connection cleanly (called during graceful shutdown)
const closeDatabase = async () => {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
  logger.info('MongoDB connection closed gracefully');
};

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDatabase, closeDatabase, isDatabaseConnected };

