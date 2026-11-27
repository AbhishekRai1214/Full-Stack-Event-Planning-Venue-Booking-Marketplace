/**
 * Contact Validation, Service, Controller & Routes
 */

const { z } = require('zod');
const Contact = require('./contact.model');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { contactRateLimiter } = require('../../middleware/rateLimiter');
const { validate } = require('../../middleware/validate');
const express = require('express');

const createContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().default(''),
  subject: z.string().max(150).optional().default('General Inquiry'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

const createInquiry = asyncHandler(async (req, res) => {
  const contact = await Contact.create({
    ...req.body,
    ipAddress: req.ip || '',
  });

  return ApiResponse.created(
    res,
    { contact },
    'Thank you for reaching out! Our team will contact you shortly.'
  );
});

const router = express.Router();

router.post(
  '/',
  contactRateLimiter,
  validate(createContactSchema),
  createInquiry
);

module.exports = router;
