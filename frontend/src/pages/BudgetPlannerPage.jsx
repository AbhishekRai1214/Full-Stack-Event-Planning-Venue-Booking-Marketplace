/**
 * BudgetPlannerPage
 *
 * Central interactive budget calculation workspace:
 * - Budget selector dropdown & "New Budget" creation modal
 * - Dynamic Summary Metric Cards (Total, Estimated, Paid, Balance)
 * - Category Allocation Multi-bar & Distribution Visualizer
 * - Editable Expense Line-Items Table with paid/pending status toggling
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBudgets,
  selectAllBudgets,
  selectCurrentBudget,
  setCurrentBudget,
  selectBudgetLoading,
  deleteBudget,
} from '@/features/budget/budgetSlice';
import BudgetSummaryCards from '@/features/budget/components/BudgetSummaryCards';
import BudgetCategoryBreakdown from '@/features/budget/components/BudgetCategoryBreakdown';
import ExpenseTable from '@/features/budget/components/ExpenseTable';
import CreateBudgetModal from '@/features/budget/components/CreateBudgetModal';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import {
  PieChart, Plus, Trash2, Calendar, Sparkles,
  ArrowRight, IndianRupee, Layers,
} from 'lucide-react';
import { formatCurrency } from '@/utils';

export const BudgetPlannerPage = () => {
  const dispatch = useDispatch();
  const budgets = useSelector(selectAllBudgets);
  const currentBudget = useSelector(selectCurrentBudget);
  const isLoading = useSelector(selectBudgetLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  const handleSelectBudget = (bId) => {
    const found = budgets.find((b) => (b._id || b.id) === bId);
    if (found) dispatch(setCurrentBudget(found));
  };

  const handleDeleteBudget = () => {
    if (!currentBudget) return;
    if (window.confirm(`Are you sure you want to delete "${currentBudget.name}"?`)) {
      dispatch(deleteBudget(currentBudget._id || currentBudget.id));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      {/* Header Banner */}
      <div className="bg-primary text-white py-12 px-4 border-b border-primary-dark">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-accent text-xs font-semibold tracking-wider uppercase mb-2">
                <PieChart className="w-4 h-4" />
                <span>Smart Event Finance Tracker</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                Event Budget Planner & Calculator
              </h1>
              <p className="mt-1 text-sm text-white/80 max-w-xl">
                Plan expenditure allocations, track vendor contract deposits, and prevent cost overruns across every celebration.
              </p>
            </div>

            <Button
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white text-white hover:text-primary border-white/20 self-start md:self-auto"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Create New Budget
            </Button>
          </div>
        </div>
      </div>

      {/* Workspace Body */}
      <div className="section-container pt-8 space-y-8">
        {/* Budget Plan Selector Switcher Bar */}
        {budgets.length > 0 && currentBudget && (
          <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" /> Active Plan:
              </span>
              <select
                value={currentBudget._id || currentBudget.id}
                onChange={(e) => handleSelectBudget(e.target.value)}
                className="py-1.5 px-3 bg-neutral-50 border border-border rounded-lg text-sm font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {budgets.map((b) => (
                  <option key={b._id || b.id} value={b._id || b.id}>
                    {b.name} ({formatCurrency(b.totalBudget)})
                  </option>
                ))}
              </select>
            </div>

            <Button
              size="xs"
              variant="ghost"
              className="text-red-600 hover:bg-red-50 self-end sm:self-auto"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={handleDeleteBudget}
            >
              Delete Plan
            </Button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && !currentBudget ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" text="Loading celebration budget..." />
          </div>
        ) : !currentBudget ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border p-8 max-w-lg mx-auto shadow-card">
            <PieChart className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-2xl text-text mb-2">No Budget Plans Found</h3>
            <p className="text-sm text-text-muted mb-6">
              Create your first event budget plan to start tracking venue bookings and vendor expenditures with smart category breakdowns.
            </p>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Start Planning Budget
            </Button>
          </div>
        ) : (
          <>
            {/* 1. Summary Cards */}
            <BudgetSummaryCards budget={currentBudget} />

            {/* 2. Category Distribution */}
            <BudgetCategoryBreakdown budget={currentBudget} />

            {/* 3. Expense Line Items Table */}
            <ExpenseTable budget={currentBudget} />
          </>
        )}
      </div>

      {/* Create Budget Modal */}
      <CreateBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default BudgetPlannerPage;
