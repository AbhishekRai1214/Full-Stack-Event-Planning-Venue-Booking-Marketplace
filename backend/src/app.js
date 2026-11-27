/**
 * Express Application Configuration
 *
 * This file configures all Express middleware and routes.
 * It does NOT start the HTTP server (that's server.js).
 *
 * WHY separate app.js from server.js:
 * - app.js exports the Express app → importable by test files
 * - server.js creates the HTTP server and connects to DB
 * - Tests can import app.js directly without starting the server
 *
 * Middleware order matters in Express:
 * 1. Security (Helmet, CORS)
 * 2. Logging
 * 3. Body parsing
 * 4. Rate limiting
 * 5. Routes
 * 6. 404 handler
 * 7. Error handler (always last, must have 4 params)
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const pinoHttp = require('pino-http');
const { isDatabaseConnected } = require('./config/database');
const logger = require('./utils/logger');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

// ─── Module Routes ─────────────────────────────────────────────────────────────
const authRoutes = require('./modules/auth/auth.routes');
// const userRoutes = require('./modules/users/user.routes');
const venueRoutes = require('./modules/venues/venue.routes');
const vendorRoutes = require('./modules/vendors/vendor.routes');
const eventRoutes = require('./modules/events/event.routes');
const bookingRoutes = require('./modules/bookings/booking.routes');
const budgetRoutes = require('./modules/budget/budget.routes');
const reviewRoutes = require('./modules/reviews/review.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const contactRoutes = require('./modules/contact/contact.routes');

const app = express();

// ─── Trust Proxy ───────────────────────────────────────────────────────────────
// Required for rate limiting to work correctly behind Nginx/load balancer
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
// Helmet sets security-related HTTP headers:
// X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS, CSP, etc.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    // Required if you embed Cloudinary images and they're on a different origin
    crossOriginEmbedderPolicy: false,
  })
);

// ─── CORS ────────────────────────────────────────────────────────────────────
// Only allow requests from known frontend origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn({ origin }, 'CORS blocked request from unknown origin');
        callback(new Error('Not allowed by CORS policy'));
      }
    },
    credentials: true, // Required for HttpOnly cookie (refresh token)
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining'],
  })
);

// ─── Request Logging ──────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    // Don't log health check requests (noise)
    autoLogging: {
      ignore: req => req.url === '/health' || req.url === '/ready',
    },
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Compression ──────────────────────────────────────────────────────────────
app.use(compression());

// ─── NoSQL Injection Prevention ───────────────────────────────────────────────
// Sanitizes user-supplied data to prevent MongoDB operator injection
// e.g., { "email": { "$gt": "" } } → safe
app.use(mongoSanitize());

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use(globalRateLimiter);

// ─── Health Check Endpoints ───────────────────────────────────────────────────
/**
 * GET /health – Liveness probe
 * Returns 200 if the process is running (regardless of DB)
 * Used by: load balancers, process monitors
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🟢 VenueAura API is running',
    version: process.env.API_VERSION || 'v1',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

/**
 * GET /ready – Readiness probe
 * Returns 200 only if the app is ready to serve traffic (DB connected)
 * Used by: Kubernetes, Railway, deployment platforms
 */
app.get('/ready', (req, res) => {
  const dbConnected = isDatabaseConnected();

  if (!dbConnected) {
    return res.status(503).json({
      success: false,
      message: '🔴 Service not ready – database not connected',
      checks: {
        database: 'disconnected',
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: '🟢 VenueAura API is ready to serve traffic',
    checks: {
      database: 'connected',
    },
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const apiVersion = process.env.API_VERSION || 'v1';
const apiRouter = express.Router();

// Mount routes as they are implemented in each phase:
apiRouter.use('/auth', authRoutes);           // Phase 6
// apiRouter.use('/users', userRoutes);          // Phase 6
apiRouter.use('/venues', venueRoutes);        // Phase 4
apiRouter.use('/vendors', vendorRoutes);      // Phase 5
apiRouter.use('/events', eventRoutes);        // Phase 7
apiRouter.use('/bookings', bookingRoutes);    // Phase 8
apiRouter.use('/budgets', budgetRoutes);      // Phase 9
apiRouter.use('/reviews', reviewRoutes);      // Phase 11
apiRouter.use('/notifications', notificationRoutes); // Phase 11
apiRouter.use('/contact', contactRoutes);    // Phase 11

// API info endpoint
apiRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to VenueAura API',
    version: apiVersion,
    documentation: `/api/${apiVersion}/docs`,
    health: '/health',
    ready: '/ready',
  });
});

app.use(`/api/${apiVersion}`, apiRouter);

// ─── 404 and Error Handling ───────────────────────────────────────────────────
// Order matters: notFound → errorHandler
app.use(notFound);
app.use(errorHandler);

module.exports = app;

