/**
 * Budget Validation Schemas (Zod)
 */

const { z } = require('zod');
const { BUDGET_CATEGORIES } = require('../../constants');

const createBudgetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  totalBudget: z.coerce.number().min(1, 'Total budget must be greater than 0'),
  eventId: z.string().optional().nullable(),
  currency: z.string().default('INR'),
  expenses: z
    .array(
      z.object({
        category: z.enum(BUDGET_CATEGORIES),
        name: z.string().min(1, 'Item name is required').max(100),
        estimatedAmount: z.coerce.number().min(0).default(0),
        actualAmount: z.coerce.number().min(0).default(0),
        isPaid: z.boolean().default(false),
        notes: z.string().max(500).optional().default(''),
      })
    )
    .optional(),
});

const updateBudgetSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  totalBudget: z.coerce.number().min(1).optional(),
  eventId: z.string().optional().nullable(),
});

const addExpenseItemSchema = z.object({
  category: z.enum(BUDGET_CATEGORIES),
  name: z.string().min(1, 'Expense item name is required').max(100),
  estimatedAmount: z.coerce.number().min(0).default(0),
  actualAmount: z.coerce.number().min(0).default(0),
  isPaid: z.boolean().default(false),
  notes: z.string().max(500).optional().default(''),
});

const updateExpenseItemSchema = addExpenseItemSchema.partial();

module.exports = {
  createBudgetSchema,
  updateBudgetSchema,
  addExpenseItemSchema,
  updateExpenseItemSchema,
};
