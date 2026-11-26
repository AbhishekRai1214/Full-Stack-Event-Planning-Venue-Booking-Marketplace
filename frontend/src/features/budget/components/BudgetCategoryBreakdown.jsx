/**
 * BudgetCategoryBreakdown Component
 *
 * Visual category distribution bars showing allocated percentage and amounts
 * across Venue, Catering, Decoration, Photography, Entertainment, etc.
 */

import React from 'react';
import { formatCurrency } from '@/utils';

const CATEGORY_COLORS = {
  venue:       'bg-primary',
  catering:    'bg-accent',
  decoration:  'bg-pink-500',
  photography: 'bg-indigo-500',
  dj:          'bg-purple-500',
  makeup:      'bg-rose-400',
  clothing:    'bg-emerald-500',
  transport:   'bg-sky-500',
  invitation:  'bg-amber-500',
  mehndi:      'bg-orange-500',
  gifts:       'bg-teal-500',
  other:       'bg-neutral-400',
};

export const BudgetCategoryBreakdown = ({ budget }) => {
  if (!budget || !budget.expenses || budget.expenses.length === 0) return null;

  const total = budget.totalBudget || 1;

  // Aggregate by category
  const categoryTotals = budget.expenses.reduce((acc, curr) => {
    const cat = curr.category || 'other';
    const amount = Number(curr.estimatedAmount) || 0;
    const actual = Number(curr.actualAmount) || 0;
    if (!acc[cat]) {
      acc[cat] = { category: cat, estimated: 0, actual: 0, count: 0 };
    }
    acc[cat].estimated += amount;
    acc[cat].actual += actual;
    acc[cat].count += 1;
    return acc;
  }, {});

  const categories = Object.values(categoryTotals).sort(
    (a, b) => b.estimated - a.estimated
  );

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
      <h3 className="font-serif font-bold text-lg text-text mb-1">
        Budget Allocation by Category
      </h3>
      <p className="text-xs text-text-muted mb-5">
        Recommended versus actual planned expenditure distribution
      </p>

      {/* Multi-segment Progress Bar */}
      <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden flex mb-6">
        {categories.map((c) => {
          const pct = Math.min(100, (c.estimated / total) * 100);
          const colorClass = CATEGORY_COLORS[c.category] || 'bg-primary';
          return (
            <div
              key={c.category}
              className={`${colorClass} h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${pct}%` }}
              title={`${c.category}: ${pct.toFixed(1)}%`}
            />
          );
        })}
      </div>

      {/* Category Pills & Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {categories.map((c) => {
          const pct = Math.round((c.estimated / total) * 100);
          const colorClass = CATEGORY_COLORS[c.category] || 'bg-primary';

          return (
            <div
              key={c.category}
              className="p-3 rounded-xl bg-neutral-50/70 border border-neutral-100 hover:border-border transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                <span className="text-xs font-semibold capitalize text-text truncate">
                  {c.category}
                </span>
                <span className="text-[10px] text-text-muted ml-auto font-mono">
                  {pct}%
                </span>
              </div>
              <p className="text-sm font-bold text-text">
                {formatCurrency(c.estimated)}
              </p>
              <p className="text-[10px] text-text-muted">
                Paid: {formatCurrency(c.actual)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetCategoryBreakdown;
