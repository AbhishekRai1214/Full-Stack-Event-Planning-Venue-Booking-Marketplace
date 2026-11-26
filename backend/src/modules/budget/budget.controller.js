/**
 * Budget Controller
 *
 * REST Controller mapping requests to BudgetService.
 */

const budgetService = require('./budget.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class BudgetController {
  createBudget = asyncHandler(async (req, res) => {
    const budget = await budgetService.createBudget(req.user.id, req.body);
    return ApiResponse.created(res, 'Budget plan created successfully', { budget });
  });

  getMyBudgets = asyncHandler(async (req, res) => {
    const budgets = await budgetService.getMyBudgets(req.user.id);
    return ApiResponse.success(res, 'User budgets retrieved successfully', { budgets });
  });

  getBudgetById = asyncHandler(async (req, res) => {
    const budget = await budgetService.getBudgetById(req.params.id, req.user);
    return ApiResponse.success(res, 'Budget details retrieved successfully', { budget });
  });

  updateBudget = asyncHandler(async (req, res) => {
    const budget = await budgetService.updateBudget(req.params.id, req.user, req.body);
    return ApiResponse.success(res, 'Budget updated successfully', { budget });
  });

  deleteBudget = asyncHandler(async (req, res) => {
    await budgetService.deleteBudget(req.params.id, req.user);
    return ApiResponse.success(res, 'Budget plan deleted successfully');
  });

  addExpense = asyncHandler(async (req, res) => {
    const budget = await budgetService.addExpense(req.params.id, req.user, req.body);
    return ApiResponse.created(res, 'Expense item added', { budget });
  });

  updateExpense = asyncHandler(async (req, res) => {
    const budget = await budgetService.updateExpense(
      req.params.id,
      req.user,
      req.params.expenseId,
      req.body
    );
    return ApiResponse.success(res, 'Expense item updated', { budget });
  });

  deleteExpense = asyncHandler(async (req, res) => {
    const budget = await budgetService.deleteExpense(
      req.params.id,
      req.user,
      req.params.expenseId
    );
    return ApiResponse.success(res, 'Expense item deleted', { budget });
  });
}

module.exports = new BudgetController();
