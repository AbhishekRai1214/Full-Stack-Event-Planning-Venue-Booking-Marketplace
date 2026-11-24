/**
 * Request Validation Middleware using Zod
 *
 * WHY Zod for backend validation (not just frontend):
 * - Frontend validation is for UX only – can be bypassed
 * - ALL security decisions must be enforced server-side
 * - Zod provides both validation AND type transformation
 *   (e.g., coerce string "100" to number 100 from query params)
 * - Schema shared between frontend (React Hook Form) and backend
 *
 * Controller pattern:
 *   Always use req.validatedBody, req.validatedQuery, req.validatedParams
 *   NEVER use req.body directly in controllers
 *   This prevents mass assignment attacks
 *
 * Usage:
 *   router.post('/venues', validate(createVenueSchema), createVenue);
 *   router.get('/venues', validate(listVenuesSchema, 'query'), listVenues);
 *
 * INTERVIEW QUESTION: What is a mass assignment attack?
 * → Attacker sends extra fields (e.g., { role: 'ADMIN', isAdmin: true })
 *   that your code blindly passes to the database.
 *   Zod strips unknown fields by default (z.object().strict() or stripUnknown).
 */

const ApiError = require('../utils/ApiError');

/**
 * Validate request data against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'query' | 'params'} source - Which part of the request to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        // code: err.code, // Uncomment for more detail during development
      }));

      return next(new ApiError(400, 'Validation failed', errors));
    }

    // Store the parsed (and transformed) data separately
    // The key is capitalized: body → validatedBody, query → validatedQuery
    const key = `validated${source.charAt(0).toUpperCase()}${source.slice(1)}`;
    req[key] = result.data;

    next();
  };
};

module.exports = { validate };

