/**
 * Budget Repository
 *
 * Data access layer for Budget documents.
 */

const Budget = require('./budget.model');

class BudgetRepository {
  async create(budgetData) {
    return Budget.create(budgetData);
  }

  async findById(id) {
    return Budget.findById(id).populate('event', 'name date eventType city guestCount');
  }

  async findByOwner(ownerId) {
    return Budget.find({ owner: ownerId })
      .populate('event', 'name date eventType city')
      .sort({ createdAt: -1 });
  }

  async findByEvent(eventId) {
    return Budget.findOne({ event: eventId });
  }

  async updateById(id, updateData) {
    // We use findById and save() so the pre-save hook re-runs calculation
    const budget = await Budget.findById(id);
    if (!budget) return null;

    Object.assign(budget, updateData);
    return budget.save();
  }

  async deleteById(id) {
    return Budget.findByIdAndDelete(id);
  }

  async addExpense(budgetId, expenseData) {
    const budget = await Budget.findById(budgetId);
    if (!budget) return null;

    budget.expenses.push(expenseData);
    return budget.save();
  }

  async updateExpense(budgetId, expenseId, updateData) {
    const budget = await Budget.findById(budgetId);
    if (!budget) return null;

    const item = budget.expenses.id(expenseId);
    if (!item) return null;

    Object.assign(item, updateData);
    return budget.save();
  }

  async deleteExpense(budgetId, expenseId) {
    const budget = await Budget.findById(budgetId);
    if (!budget) return null;

    budget.expenses.pull({ _id: expenseId });
    return budget.save();
  }
}

module.exports = new BudgetRepository();
