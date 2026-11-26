/**
 * BudgetSummaryCards Component
 *
 * Visual metric tiles displaying Total Budget, Estimated Spend,
 * Actual Spend, and Remaining Balance with dynamic status indicators.
 */

import React from 'react';
import { IndianRupee, PieChart, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils';

export const BudgetSummaryCards = ({ budget }) => {
  if (!budget) return null;

  const total = budget.totalBudget || 0;
  const estimated = budget.totalEstimated || 0;
  const actual = budget.totalActual || 0;
  const remaining = budget.remainingBudget || 0;
  const utilization = budget.utilizationPercent || 0;

  const isOverBudget = (actual > total) || (estimated > total && actual === 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Planned Budget */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-card flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Total Budget
          </p>
          <p className="text-2xl font-serif font-bold text-text mt-1">
            {formatCurrency(total)}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">Target spend cap</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <IndianRupee className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Estimated Spend */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-card flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Estimated Cost
          </p>
          <p className="text-2xl font-serif font-bold text-text mt-1">
            {formatCurrency(estimated)}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {budget.expenses?.length || 0} category line items
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent-700 flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Actual Amount Paid */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-card flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Actual Paid Out
          </p>
          <p className="text-2xl font-serif font-bold text-green-600 mt-1">
            {formatCurrency(actual)}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            Cleared deposits & payments
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
          <CheckCircle className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Remaining Balance & Utilization */}
      <div className={`p-5 rounded-2xl border shadow-card flex items-center justify-between ${
        isOverBudget
          ? 'bg-red-50/60 border-red-200'
          : 'bg-white border-border'
      }`}>
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Remaining Funds
          </p>
          <p className={`text-2xl font-serif font-bold mt-1 ${
            isOverBudget ? 'text-red-600' : 'text-primary'
          }`}>
            {formatCurrency(remaining)}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {utilization}% budget utilized
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isOverBudget
            ? 'bg-red-100 text-red-600'
            : 'bg-primary-50 text-primary'
        }`}>
          {isOverBudget ? (
            <AlertCircle className="w-6 h-6" />
          ) : (
            <PieChart className="w-6 h-6" />
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryCards;
