/**
 * Budget Slice – Redux Toolkit
 *
 * Manages budget state, active budget plan, category metrics, and expense CRUD.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import budgetApi from './budgetApi';

const initialState = {
  budgets: [],
  currentBudget: null,
  isLoading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk('budget/fetchBudgets', async (_, { rejectWithValue }) => {
  try {
    return await budgetApi.getBudgets();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load budgets');
  }
});

export const fetchBudgetById = createAsyncThunk('budget/fetchBudgetById', async (id, { rejectWithValue }) => {
  try {
    return await budgetApi.getBudgetById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load budget');
  }
});

export const createBudget = createAsyncThunk('budget/createBudget', async (data, { rejectWithValue }) => {
  try {
    return await budgetApi.createBudget(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create budget');
  }
});

export const updateBudget = createAsyncThunk('budget/updateBudget', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await budgetApi.updateBudget(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update budget');
  }
});

export const deleteBudget = createAsyncThunk('budget/deleteBudget', async (id, { rejectWithValue }) => {
  try {
    return await budgetApi.deleteBudget(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete budget');
  }
});

export const addExpenseItem = createAsyncThunk('budget/addExpenseItem', async ({ budgetId, expense }, { rejectWithValue }) => {
  try {
    return await budgetApi.addExpense(budgetId, expense);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to add expense');
  }
});

export const updateExpenseItem = createAsyncThunk('budget/updateExpenseItem', async ({ budgetId, expenseId, data }, { rejectWithValue }) => {
  try {
    return await budgetApi.updateExpense(budgetId, expenseId, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update expense');
  }
});

export const deleteExpenseItem = createAsyncThunk('budget/deleteExpenseItem', async ({ budgetId, expenseId }, { rejectWithValue }) => {
  try {
    return await budgetApi.deleteExpense(budgetId, expenseId);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete expense');
  }
});

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setCurrentBudget: (state, action) => {
      state.currentBudget = action.payload;
    },
    clearCurrentBudget: (state) => {
      state.currentBudget = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBudgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload;
        if (!state.currentBudget && action.payload.length > 0) {
          state.currentBudget = action.payload[0];
        }
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchBudgetById
      .addCase(fetchBudgetById.fulfilled, (state, action) => {
        state.currentBudget = action.payload;
      })
      // createBudget
      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.unshift(action.payload);
        state.currentBudget = action.payload;
      })
      // updateBudget
      .addCase(updateBudget.fulfilled, (state, action) => {
        const idx = state.budgets.findIndex((b) => (b._id || b.id) === (action.payload._id || action.payload.id));
        if (idx !== -1) state.budgets[idx] = action.payload;
        if (state.currentBudget && (state.currentBudget._id || state.currentBudget.id) === (action.payload._id || action.payload.id)) {
          state.currentBudget = action.payload;
        }
      })
      // deleteBudget
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter((b) => (b._id || b.id) !== action.payload);
        if (state.currentBudget && (state.currentBudget._id || state.currentBudget.id) === action.payload) {
          state.currentBudget = state.budgets[0] || null;
        }
      })
      // Expense actions update currentBudget and list item
      .addCase(addExpenseItem.fulfilled, (state, action) => {
        state.currentBudget = action.payload;
        const idx = state.budgets.findIndex((b) => (b._id || b.id) === (action.payload._id || action.payload.id));
        if (idx !== -1) state.budgets[idx] = action.payload;
      })
      .addCase(updateExpenseItem.fulfilled, (state, action) => {
        state.currentBudget = action.payload;
        const idx = state.budgets.findIndex((b) => (b._id || b.id) === (action.payload._id || action.payload.id));
        if (idx !== -1) state.budgets[idx] = action.payload;
      })
      .addCase(deleteExpenseItem.fulfilled, (state, action) => {
        state.currentBudget = action.payload;
        const idx = state.budgets.findIndex((b) => (b._id || b.id) === (action.payload._id || action.payload.id));
        if (idx !== -1) state.budgets[idx] = action.payload;
      });
  },
});

export const { setCurrentBudget, clearCurrentBudget } = budgetSlice.actions;

export const selectAllBudgets = (state) => state.budget.budgets;
export const selectCurrentBudget = (state) => state.budget.currentBudget;
export const selectBudgetLoading = (state) => state.budget.isLoading;
export const selectBudgetError = (state) => state.budget.error;

export default budgetSlice.reducer;
