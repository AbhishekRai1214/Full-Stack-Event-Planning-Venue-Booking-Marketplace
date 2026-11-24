import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
  PieChart,
} from 'lucide-react';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils';
import { SAMPLE_BUILD_YOUR_EVENT } from '../data/homeData';

export const BuildYourEventSection = () => {
  const [totalBudget, setTotalBudget] = useState(SAMPLE_BUILD_YOUR_EVENT.totalBudget);
  const [items, setItems] = useState(SAMPLE_BUILD_YOUR_EVENT.selectedItems);

  const totalSpent = items.reduce((acc, item) => acc + item.cost, 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const utilizationPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className="section-padding bg-background border-t border-border">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary text-xs font-semibold uppercase tracking-wider block mb-1.5">
            Smart Budgeting
          </span>
          <h2 className="text-display-sm md:text-display-md font-serif font-bold text-text">
            Build Your Event, Your Way
          </h2>
          <p className="text-text-muted text-sm md:text-base mt-2">
            Calculate your wedding or party expenses in real time. Combine your selected venue and services with full budget transparency.
          </p>
        </div>

        {/* Interactive Widget Box */}
        <div className="card bg-white border border-border shadow-card p-6 md:p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Selected Services List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-serif font-bold text-lg text-text flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Selected Event Components ({items.length})</span>
                </h3>
                <span className="text-xs text-text-muted">Live Preview</span>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-card bg-background-secondary border border-border/80 transition-all hover:border-primary/40"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {item.category}
                      </span>
                      <h4 className="font-medium text-sm text-text mt-1">
                        {item.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-sm text-text">
                        {formatCurrency(item.cost)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-text-muted hover:text-error p-1 rounded transition-colors"
                        title="Remove service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && (
                <div className="p-8 text-center bg-background-secondary rounded-card text-text-muted text-sm">
                  No items selected yet. Choose venues and vendors to track your budget.
                </div>
              )}
            </div>

            {/* Right Column: Real-time Budget Utilization Card */}
            <div className="lg:col-span-5 p-6 rounded-card-lg bg-neutral-900 text-white space-y-6">
              <div>
                <span className="text-xs text-primary font-semibold uppercase tracking-wider block mb-1">
                  Budget Utilization
                </span>
                <h4 className="font-serif font-bold text-2xl text-white">
                  {formatCurrency(totalSpent)}
                  <span className="text-sm font-normal text-neutral-400"> of {formatCurrency(totalBudget)}</span>
                </h4>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-neutral-300 mb-2">
                  <span>{utilizationPercent}% Utilized</span>
                  <span>{formatCurrency(remainingBudget)} Remaining</span>
                </div>
                <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-neutral-700">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${utilizationPercent}%` }}
                  />
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800 text-xs">
                <div className="p-3 rounded-md bg-neutral-800/80">
                  <span className="text-neutral-400 block mb-0.5">Total Spent</span>
                  <span className="font-bold text-base text-white">
                    {formatCurrency(totalSpent)}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-neutral-800/80">
                  <span className="text-neutral-400 block mb-0.5">Remaining</span>
                  <span className="font-bold text-base text-primary">
                    {formatCurrency(remainingBudget)}
                  </span>
                </div>
              </div>

              {/* CTA to Full Budget Planner */}
              <Link to="/budget" className="block pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Open Full Budget Planner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildYourEventSection;
