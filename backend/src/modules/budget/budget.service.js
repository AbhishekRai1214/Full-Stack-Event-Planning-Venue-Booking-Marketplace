/**
 * Budget Service
 *
 * Implements budget management business logic with resource ownership checks
 * and auto-preset template generation.
 */

const budgetRepository = require('./budget.repository');
const ApiError = require('../../utils/ApiError');
const { ROLES } = require('../../constants');

// Default recommended percentage splits for wedding/event planning
const DEFAULT_PRESET_SPLITS = [
  { category: 'venue', percent: 40, name: 'Main Venue Rental & Lawn' },
  { category: 'catering', percent: 25, name: 'Catering & Beverages (Per Plate)' },
  { category: 'decoration', percent: 12, name: 'Floral Stage & Lighting Decor' },
  { category: 'photography', percent: 8, name: 'Cinematography & Candid Photos' },
  { category: 'dj', percent: 4, name: 'DJ, Sound & Sangeet Acoustics' },
  { category: 'makeup', percent: 4, name: 'Bridal & Family Makeup' },
  { category: 'clothing', percent: 4, name: 'Wedding Outfits & Attire' },
  { category: 'invitation', percent: 3, name: 'Digital & Physical Invitations' },
];

class BudgetService {
  async createBudget(userId, data) {
    let expenses = data.expenses || [];

    // If no expenses are provided, populate with standard recommended breakdown
    if (expenses.length === 0 && data.totalBudget > 0) {
      expenses = DEFAULT_PRESET_SPLITS.map((preset) => ({
        category: preset.category,
        name: preset.name,
        estimatedAmount: Math.round((data.totalBudget * preset.percent) / 100),
        actualAmount: 0,
        isPaid: false,
        notes: `Estimated at ${preset.percent}% of total budget`,
      }));
    }

    const payload = {
      ...data,
      owner: userId,
      event: data.eventId || null,
      expenses,
    };

    return budgetRepository.create(payload);
  }

  async getMyBudgets(userId) {
    return budgetRepository.findByOwner(userId);
  }

  async getBudgetById(budgetId, user) {
    const budget = await budgetRepository.findById(budgetId);
    if (!budget) {
      throw new ApiError(404, 'Budget plan not found');
    }

    if (budget.owner.toString() !== user.id && user.role !== ROLES.ADMIN) {
      throw new ApiError(403, 'You do not have permission to view this budget');
    }

    return budget;
  }

  async updateBudget(budgetId, user, updateData) {
    await this.getBudgetById(budgetId, user);
    return budgetRepository.updateById(budgetId, updateData);
  }

  async deleteBudget(budgetId, user) {
    await this.getBudgetById(budgetId, user);
    return budgetRepository.deleteById(budgetId);
  }

  async addExpense(budgetId, user, expenseData) {
    await this.getBudgetById(budgetId, user);
    return budgetRepository.addExpense(budgetId, expenseData);
  }

  async updateExpense(budgetId, user, expenseId, updateData) {
    await this.getBudgetById(budgetId, user);
    const updated = await budgetRepository.updateExpense(budgetId, expenseId, updateData);
    if (!updated) {
      throw new ApiError(404, 'Expense item not found');
    }
    return updated;
  }

  async deleteExpense(budgetId, user, expenseId) {
    await this.getBudgetById(budgetId, user);
    return budgetRepository.deleteExpense(budgetId, expenseId);
  }
}

module.exports = new BudgetService();
