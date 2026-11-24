/**
 * Environment Configuration
 *
 * Validates all required environment variables at startup using Zod.
 * If any required variable is missing or invalid, the server exits immediately.
 *
 * WHY: Fail fast at startup rather than failing mysteriously at runtime.
 * This makes misconfiguration immediately obvious instead of causing
 * subtle bugs when env vars are silently undefined.
 */

const { z } = require('zod');

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  API_VERSION: z.string().default('v1'),

  // Database
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // JWT
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, 'ACCESS_TOKEN_SECRET must be at least 32 characters for security'),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, 'REFRESH_TOKEN_SECRET must be at least 32 characters for security'),
  ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),

  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),

  // Cloudinary (optional until Phase 13)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Razorpay (optional until Phase 13)
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),

  // Email (optional until Phase 11)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Logging
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('\n❌ Invalid environment variables:\n');
  result.error.errors.forEach(err => {
    console.error(`   ${err.path.join('.')}: ${err.message}`);
  });
  console.error('\n📋 Check backend/.env.example for the required format.\n');
  process.exit(1);
}

module.exports = result.data;

