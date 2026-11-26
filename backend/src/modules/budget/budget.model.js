/**
 * Budget Mongoose Model
 *
 * Stores event budgets, categorised expense line items, and auto-computed summary metrics:
 * - totalEstimated
 * - totalActual
 * - remainingBudget
 * - utilizationPercent
 *
 * COMPUTED TOTALS:
 * Computed on save in a pre-save hook so summary numbers are always consistent,
 * fast to query, and never manipulable from client payloads.
 */

const mongoose = require('mongoose');
const { BUDGET_CATEGORIES } = require('../../constants');

const expenseItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: BUDGET_CATEGORIES,
      required: [true, 'Expense category is required'],
      default: 'other',
    },
    name: {
      type: String,
      required: [true, 'Expense item name is required'],
      trim: true,
      maxlength: [100, 'Item name cannot exceed 100 characters'],
    },
    estimatedAmount: {
      type: Number,
      required: [true, 'Estimated amount is required'],
      min: [0, 'Estimated amount cannot be negative'],
      default: 0,
    },
    actualAmount: {
      type: Number,
      min: [0, 'Actual amount cannot be negative'],
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const budgetSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Budget owner is required'],
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Budget plan name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    totalBudget: {
      type: Number,
      required: [true, 'Total budget amount is required'],
      min: [1, 'Total budget must be at least ₹1'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    expenses: [expenseItemSchema],

    // Computed summary fields (calculated server-side in pre-save)
    totalEstimated: {
      type: Number,
      default: 0,
    },
    totalActual: {
      type: Number,
      default: 0,
    },
    remainingBudget: {
      type: Number,
      default: 0,
    },
    utilizationPercent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
budgetSchema.index({ owner: 1, createdAt: -1 });

/**
 * Pre-save hook: auto-compute totals and utilization percentages
 */
budgetSchema.pre('save', function (next) {
  const expenses = this.expenses || [];

  this.totalEstimated = expenses.reduce(
    (sum, item) => sum + (Number(item.estimatedAmount) || 0),
    0
  );

  this.totalActual = expenses.reduce(
    (sum, item) => sum + (Number(item.actualAmount) || 0),
    0
  );

  // Utilization based on actual spend, or estimated spend if actual is 0
  const spendToTrack = this.totalActual > 0 ? this.totalActual : this.totalEstimated;
  this.remainingBudget = Math.max(0, this.totalBudget - spendToTrack);

  this.utilizationPercent =
    this.totalBudget > 0
      ? Math.round((spendToTrack / this.totalBudget) * 100)
      : 0;

  next();
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
