/**
 * Auth Request Validation Schemas
 *
 * Uses Zod for strict schema validation.
 */

const { z } = require('zod');
const { ROLES } = require('../../constants');

// Self-registration can only be CUSTOMER or VENDOR (ADMIN cannot be self-assigned)
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name cannot exceed 60 characters'),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z
    .string()
    .regex(/^[0-9+\s\-()]{7,15}$/, 'Please provide a valid phone number')
    .optional(),
  role: z.enum([ROLES.CUSTOMER, ROLES.VENDOR]).default(ROLES.CUSTOMER),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(), // Can also come from cookie
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  phone: z.string().regex(/^[0-9+\s\-()]{7,15}$/).optional(),
  avatar: z.object({
    url: z.string().url(),
    publicId: z.string().optional().nullable(),
  }).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
};
