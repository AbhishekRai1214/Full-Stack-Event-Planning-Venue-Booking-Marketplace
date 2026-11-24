/**
 * asyncHandler – Async Route Handler Wrapper
 *
 * WHY: Express does not automatically catch errors thrown inside async
 * route handlers. Without this wrapper, every controller would need a
 * try/catch block that calls next(error).
 *
 * This wrapper:
 * - Wraps any async function
 * - Catches rejected promises automatically
 * - Passes the error to Express's next() for centralized handling
 *
 * Before (without asyncHandler):
 *   router.get('/venues', async (req, res, next) => {
 *     try {
 *       const venues = await venueService.getAll();
 *       res.json(venues);
 *     } catch (err) {
 *       next(err); // ← repeated in every controller
 *     }
 *   });
 *
 * After (with asyncHandler):
 *   router.get('/venues', asyncHandler(async (req, res) => {
 *     const venues = await venueService.getAll();
 *     res.json(venues); // errors auto-forwarded to errorHandler middleware
 *   }));
 *
 * INTERVIEW QUESTION: How do you handle errors in Express async routes?
 * → Use a wrapper that catches Promise rejections and calls next(err).
 */

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

