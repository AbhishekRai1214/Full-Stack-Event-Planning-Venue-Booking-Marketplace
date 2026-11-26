/**
 * Budget Routes
 *
 * Endpoints:
 * - POST   /api/v1/budgets
 * - GET    /api/v1/budgets
 * - GET    /api/v1/budgets/:id
 * - PATCH  /api/v1/budgets/:id
 * - DELETE /api/v1/budgets/:id
 * - POST   /api/v1/budgets/:id/expenses
 * - PATCH  /api/v1/budgets/:id/expenses/:expenseId
 * - DELETE /api/v1/budgets/:id/expenses/:expenseId
 */

const express = require('express');
const budgetController = require('./budget.controller');
const { authenticate } = require('../../middleware/authenticate');
const { validate } = require('../../middleware/validate');
const {
  createBudgetSchema,
  updateBudgetSchema,
  addExpenseItemSchema,
  updateExpenseItemSchema,
} = require('./budget.validation');

const router = express.Router();

// All budget operations require an authenticated user
router.use(authenticate);

router
  .route('/')
  .post(validate(createBudgetSchema), budgetController.createBudget)
  .get(budgetController.getMyBudgets);

router
  .route('/:id')
  .get(budgetController.getBudgetById)
  .patch(validate(updateBudgetSchema), budgetController.updateBudget)
  .delete(budgetController.deleteBudget);

router.post(
  '/:id/expenses',
  validate(addExpenseItemSchema),
  budgetController.addExpense
);

router
  .route('/:id/expenses/:expenseId')
  .patch(validate(updateExpenseItemSchema), budgetController.updateExpense)
  .delete(budgetController.deleteExpense);

module.exports = router;
