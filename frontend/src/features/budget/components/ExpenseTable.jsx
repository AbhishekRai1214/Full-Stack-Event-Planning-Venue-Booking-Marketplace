/**
 * ExpenseTable Component
 *
 * Interactive expense line-item table allowing users to:
 * - Mark expenses as Paid / Unpaid with instant status reflection
 * - Add new expense items with custom categories
 * - Edit estimates and actual paid amounts inline
 * - Delete line items
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  addExpenseItem,
  updateExpenseItem,
  deleteExpenseItem,
} from '../budgetSlice';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Plus, Trash2, CheckCircle2, Circle, Edit2, X, Check } from 'lucide-react';
import { formatCurrency } from '@/utils';

const CATEGORIES = [
  'venue', 'catering', 'decoration', 'photography',
  'dj', 'transport', 'makeup', 'mehndi', 'invitation',
  'clothing', 'gifts', 'other',
];

export const ExpenseTable = ({ budget }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    category: 'venue',
    estimatedAmount: '',
    actualAmount: '',
    isPaid: false,
    notes: '',
  });

  if (!budget) return null;
  const budgetId = budget._id || budget.id;
  const expenses = budget.expenses || [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.name.trim()) return;

    dispatch(
      addExpenseItem({
        budgetId,
        expense: {
          ...newExpense,
          estimatedAmount: Number(newExpense.estimatedAmount) || 0,
          actualAmount: Number(newExpense.actualAmount) || 0,
        },
      })
    );

    setNewExpense({
      name: '',
      category: 'venue',
      estimatedAmount: '',
      actualAmount: '',
      isPaid: false,
      notes: '',
    });
    setIsAdding(false);
  };

  const handleTogglePaid = (expense) => {
    const expId = expense._id || expense.id;
    dispatch(
      updateExpenseItem({
        budgetId,
        expenseId: expId,
        data: { isPaid: !expense.isPaid },
      })
    );
  };

  const handleDelete = (expenseId) => {
    if (window.confirm('Delete this expense line item?')) {
      dispatch(deleteExpenseItem({ budgetId, expenseId }));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-text">
            Expense Breakdown & Tracking
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Track individual vendor contracts, deposits, and payment statuses
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAdding(!isAdding)}
        >
          Add Expense Item
        </Button>
      </div>

      {/* Add Expense Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-5 bg-primary-50/60 border-b border-primary-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
        >
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-semibold uppercase text-text mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              placeholder="e.g. Sangeet Stage Sound Setup"
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-text mb-1">
              Category
            </label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs capitalize focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-text mb-1">
              Estimated (₹)
            </label>
            <input
              type="number"
              min="0"
              value={newExpense.estimatedAmount}
              onChange={(e) => setNewExpense({ ...newExpense, estimatedAmount: e.target.value })}
              placeholder="50000"
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} type="button">
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b border-border text-text-muted uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Expense Item</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Estimated</th>
              <th className="py-3 px-4 text-right">Actual Paid</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-text-muted text-xs">
                  No expense items logged yet. Click "Add Expense Item" above to get started.
                </td>
              </tr>
            ) : (
              expenses.map((item) => {
                const expId = item._id || item.id;
                return (
                  <tr key={expId} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Status Pill / Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePaid(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                          item.isPaid
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-neutral-100 text-text-muted hover:bg-neutral-200'
                        }`}
                        title="Click to toggle paid status"
                      >
                        {item.isPaid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span>Paid</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3 h-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Name & Notes */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-text text-xs">{item.name}</p>
                      {item.notes && (
                        <p className="text-[11px] text-text-muted mt-0.5 truncate max-w-xs">
                          {item.notes}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="capitalize font-medium text-text bg-neutral-100 px-2 py-0.5 rounded-md text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    {/* Estimated */}
                    <td className="py-3.5 px-4 text-right font-semibold text-text whitespace-nowrap">
                      {formatCurrency(item.estimatedAmount)}
                    </td>

                    {/* Actual Paid */}
                    <td className="py-3.5 px-4 text-right font-bold text-green-600 whitespace-nowrap">
                      {formatCurrency(item.actualAmount || 0)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(expId)}
                        className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
