/**
 * Structured Logger using Pino
 *
 * WHY PINO over console.log:
 * - Structured JSON output (parseable by log aggregation tools)
 * - Significantly faster than Winston or Bunyan
 * - Automatic redaction of sensitive fields (passwords, tokens)
 * - Log levels (trace/debug/info/warn/error/fatal)
 * - Pretty output for development, JSON for production
 *
 * NEVER log: passwords, JWT tokens, refresh tokens, payment secrets, PII
 */

const pino = require('pino');

// Read log level directly from process.env to avoid circular dep with config/env.js
const level = process.env.LOG_LEVEL || 'info';
const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level,

  // Pretty print in development for readability
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{msg}',
      },
    },
  }),

  // Redact sensitive fields from all log output
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.confirmPassword',
      'req.body.newPassword',
      'req.body.currentPassword',
      '*.token',
      '*.refreshToken',
      '*.accessToken',
      '*.secret',
      '*.password',
    ],
    censor: '[REDACTED]',
  },

  // Base fields added to every log
  base: {
    env: process.env.NODE_ENV,
  },

  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;

