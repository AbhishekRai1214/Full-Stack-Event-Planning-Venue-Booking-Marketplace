/**
 * Server Entry Point
 *
 * Responsibilities:
 * 1. Load environment variables (must be FIRST)
 * 2. Connect to MongoDB
 * 3. Start the HTTP server
 * 4. Handle graceful shutdown
 * 5. Handle uncaught exceptions and unhandled rejections
 *
 * WHY separate server.js from app.js:
 * - Tests import app.js directly without starting the server
 * - Graceful shutdown logic belongs here, not in the app
 * - Database connection is a server concern, not an app concern
 *
 * GRACEFUL SHUTDOWN:
 * When the process receives SIGTERM (from Kubernetes, Railway, etc.),
 * we stop accepting new requests, wait for in-flight requests to finish,
 * then close the DB connection and exit cleanly.
 * This prevents data corruption and dropped requests during deployments.
 */

// ⚠️  MUST be the very first line – loads .env before ANY other require
require('dotenv').config();

const http = require('http');
const app = require('./app');
const { connectDatabase, closeDatabase } = require('./config/database');
const { initSocket } = require('./config/socket');
const logger = require('./utils/logger');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Create HTTP server (wrapping Express app)
// This allows us to handle WebSocket upgrades in the future if needed
const server = http.createServer(app);

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB before accepting requests
    await connectDatabase();

    // Initialize Socket.io real-time engine
    initSocket(server);

    server.listen(PORT, () => {
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info('🏛️  VenueAura API Server Started');
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info(`   Mode:    ${process.env.NODE_ENV}`);
      logger.info(`   Port:    ${PORT}`);
      logger.info(`   API:     http://localhost:${PORT}/api/${API_VERSION}`);
      logger.info(`   Health:  http://localhost:${PORT}/health`);
      logger.info(`   Docs:    http://localhost:${PORT}/api/${API_VERSION}/docs`);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = signal => async () => {
  logger.info(`\n${signal} received. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed – no longer accepting new connections');

    try {
      // Close database connection cleanly
      await closeDatabase();
      logger.info('All connections closed. Exiting process.');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during graceful shutdown');
      process.exit(1);
    }
  });

  // Force exit if graceful shutdown takes too long (30 seconds)
  setTimeout(() => {
    logger.error('Graceful shutdown timed out after 30s. Forcing exit.');
    process.exit(1);
  }, 30_000);
};

process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('SIGINT', gracefulShutdown('SIGINT'));

// ─── Unhandled Error Handlers ─────────────────────────────────────────────────
// These catch programming errors (bugs) that escaped normal error handling.
// The correct behavior for uncaught exceptions is to crash and restart
// (via PM2, Docker, Kubernetes) rather than continue in an unknown state.

process.on('uncaughtException', err => {
  logger.fatal({ err }, '💥 UNCAUGHT EXCEPTION – Process will exit');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, '💥 UNHANDLED PROMISE REJECTION – Process will exit');
  server.close(() => process.exit(1));
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────
startServer();

