/**
 * EventChecklist Component
 *
 * Interactive checklist manager for an event:
 * - Mark tasks completed / pending with instant updates
 * - Add new tasks with category tag
 * - Delete tasks
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTask, addTask, removeTask } from '../eventsSlice';
import { Check, Plus, Trash2, Tag, Calendar, CheckCircle2, Circle } from 'lucide-react';
import Button from '@/components/common/Button';

export const EventChecklist = ({ event }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [isAdding, setIsAdding] = useState(false);

  const dispatch = useDispatch();
  const eventId = event._id || event.id;
  const checklist = event.checklist || [];

  const completedCount = checklist.filter((t) => t.isCompleted).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (taskId) => {
    dispatch(toggleTask({ eventId, taskId }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    dispatch(addTask({ eventId, task: { title: newTitle, category: newCategory } }));
    setNewTitle('');
    setIsAdding(false);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(removeTask({ eventId, taskId }));
  };

  const categories = ['General', 'Venue', 'Catering', 'Photography', 'Decoration', 'Entertainment', 'Guests', 'Gifts'];

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <h3 className="font-serif font-bold text-xl text-text">Celebration Checklist</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Keep track of every task, vendor appointment, and milestone
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-text">
              {completedCount} of {totalCount} completed
            </span>
            <div className="w-32 bg-neutral-100 h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAdding(!isAdding)}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Add Task Quick Form */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="mb-6 p-4 bg-primary-50/50 border border-primary-100 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Schedule bridal hair trial with artist..."
              className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="xs" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button size="xs" variant="primary" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {checklist.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">
            No tasks added yet. Click "Add Task" to start planning!
          </div>
        ) : (
          checklist.map((item) => {
            const taskId = item._id || item.id;
            return (
              <div
                key={taskId}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  item.isCompleted
                    ? 'bg-neutral-50/60 border-neutral-100 text-text-muted'
                    : 'bg-white border-border hover:border-primary/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(taskId)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                      item.isCompleted
                        ? 'bg-primary text-white'
                        : 'border-2 border-neutral-300 hover:border-primary'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <span
                    className={`text-sm select-none truncate ${
                      item.isCompleted ? 'line-through text-text-muted' : 'text-text font-medium'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-text-muted">
                    {item.category || 'General'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(taskId)}
                    className="p-1 text-text-muted hover:text-red-600 transition-colors rounded-md"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventChecklist;
