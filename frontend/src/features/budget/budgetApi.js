/**
 * Budget API Client
 *
 * Connects frontend to backend /budgets endpoints with local mock fallback
 * for offline, sandbox, and demo presentation.
 */

import api from '@/services/api';

const DEFAULT_MOCK_BUDGETS = [
  {
    _id: 'bgt_1',
    id: 'bgt_1',
    name: 'Royal Heritage Wedding Budget Plan',
    totalBudget: 2500000,
    currency: 'INR',
    totalEstimated: 2475000,
    totalActual: 1520000,
    remainingBudget: 980000,
    utilizationPercent: 61,
    expenses: [
      {
        _id: 'exp_1',
        category: 'venue',
        name: 'The Oberoi Rajvilas Main Courtyard & Lawn',
        estimatedAmount: 1000000,
        actualAmount: 1000000,
        isPaid: true,
        notes: 'Deposit and full rental payment cleared',
      },
      {
        _id: 'exp_2',
        category: 'catering',
        name: 'Royal Rajasthani & Continental 7-Course Banquet',
        estimatedAmount: 625000,
        actualAmount: 320000,
        isPaid: false,
        notes: '50% advance deposit paid to master chef team',
      },
      {
        _id: 'exp_3',
        category: 'decoration',
        name: 'Palace Stage Floral Arch, Fairy Lights & Mandap',
        estimatedAmount: 300000,
        actualAmount: 100000,
        isPaid: false,
        notes: 'Sufi night & wedding floral concepts approved',
      },
      {
        _id: 'exp_4',
        category: 'photography',
        name: 'Studio Lumière 3-Day Cinematic & Candid Coverage',
        estimatedAmount: 200000,
        actualAmount: 100000,
        isPaid: false,
        notes: 'Drone coverage and teaser video included',
      },
      {
        _id: 'exp_5',
        category: 'dj',
        name: 'Acoustic Sound & Sangeet DJ Setup',
        estimatedAmount: 100000,
        actualAmount: 0,
        isPaid: false,
        notes: 'Equipment sound check scheduled for rehearsal',
      },
      {
        _id: 'exp_6',
        category: 'makeup',
        name: 'Bridal Couture Makeup & Hair Styling',
        estimatedAmount: 100000,
        actualAmount: 0,
        isPaid: false,
        notes: 'Hair trial and saree draping assistant included',
      },
      {
        _id: 'exp_7',
        category: 'clothing',
        name: 'Designer Bridal Lehenga & Sherwani',
        estimatedAmount: 100000,
        actualAmount: 0,
        isPaid: false,
        notes: 'Fittings scheduled in Delhi',
      },
      {
        _id: 'exp_8',
        category: 'invitation',
        name: 'Wax-Sealed Luxury Boxed Invitations & Digital Site',
        estimatedAmount: 50000,
        actualAmount: 0,
        isPaid: false,
        notes: 'Dispatched to 250 families',
      },
    ],
  },
];

export const budgetApi = {
  getBudgets: async () => {
    try {
      const res = await api.get('/budgets');
      return res.data.data.budgets;
    } catch (err) {
      console.warn('Backend unavailable, using mock budgets dataset');
      const stored = localStorage.getItem('venueaura_mock_budgets');
      return stored ? JSON.parse(stored) : DEFAULT_MOCK_BUDGETS;
    }
  },

  getBudgetById: async (id) => {
    try {
      const res = await api.get(`/budgets/${id}`);
      return res.data.data.budget;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_budgets');
      const list = stored ? JSON.parse(stored) : DEFAULT_MOCK_BUDGETS;
      const found = list.find((b) => (b._id || b.id) === id);
      if (found) return found;
      throw err;
    }
  },

  createBudget: async (data) => {
    try {
      const res = await api.post('/budgets', data);
      return res.data.data.budget;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_budgets');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_BUDGETS];

      const total = Number(data.totalBudget);
      const expenses = (data.expenses && data.expenses.length > 0)
        ? data.expenses
        : [
            { _id: 'e1', category: 'venue', name: 'Main Venue Rental', estimatedAmount: Math.round(total * 0.4), actualAmount: 0, isPaid: false, notes: '40% allocation' },
            { _id: 'e2', category: 'catering', name: 'Catering & Dining', estimatedAmount: Math.round(total * 0.25), actualAmount: 0, isPaid: false, notes: '25% allocation' },
            { _id: 'e3', category: 'decoration', name: 'Floral Stage & Lighting', estimatedAmount: Math.round(total * 0.12), actualAmount: 0, isPaid: false, notes: '12% allocation' },
            { _id: 'e4', category: 'photography', name: 'Photography & Film', estimatedAmount: Math.round(total * 0.08), actualAmount: 0, isPaid: false, notes: '8% allocation' },
            { _id: 'e5', category: 'dj', name: 'DJ & Sound System', estimatedAmount: Math.round(total * 0.05), actualAmount: 0, isPaid: false, notes: '5% allocation' },
            { _id: 'e6', category: 'clothing', name: 'Outfits & Styling', estimatedAmount: Math.round(total * 0.05), actualAmount: 0, isPaid: false, notes: '5% allocation' },
            { _id: 'e7', category: 'makeup', name: 'Hair & Makeup', estimatedAmount: Math.round(total * 0.05), actualAmount: 0, isPaid: false, notes: '5% allocation' },
          ];

      const totalEst = expenses.reduce((s, i) => s + (Number(i.estimatedAmount) || 0), 0);
      const totalAct = expenses.reduce((s, i) => s + (Number(i.actualAmount) || 0), 0);

      const newBudget = {
        _id: 'bgt_' + Date.now(),
        id: 'bgt_' + Date.now(),
        name: data.name,
        totalBudget: total,
        currency: 'INR',
        totalEstimated: totalEst,
        totalActual: totalAct,
        remainingBudget: Math.max(0, total - (totalAct || totalEst)),
        utilizationPercent: Math.round(((totalAct || totalEst) / total) * 100),
        expenses,
        createdAt: new Date().toISOString(),
      };

      list.unshift(newBudget);
      localStorage.setItem('venueaura_mock_budgets', JSON.stringify(list));
      return newBudget;
    }
  },

  updateBudget: async (id, data) => {
    try {
      const res = await api.patch(`/budgets/${id}`, data);
      return res.data.data.budget;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_budgets');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_BUDGETS];
      const idx = list.findIndex((b) => (b._id || b.id) === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        localStorage.setItem('venueaura_mock_budgets', JSON.stringify(list));
        return list[idx];
      }
      throw err;
    }
  },

  deleteBudget: async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      return id;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_budgets');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_BUDGETS];
      const filtered = list.filter((b) => (b._id || b.id) !== id);
      localStorage.setItem('venueaura_mock_budgets', JSON.stringify(filtered));
      return id;
    }
  },

  addExpense: async (budgetId, expense) => {
    try {
      const res = await api.post(`/budgets/${budgetId}/expenses`, expense);
      return res.data.data.budget;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_budgets');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_BUDGETS];
      const idx = list.findIndex((b) => (b._id || b.id) === budgetId);
      if (idx !== -1) {
        const item = {
          _id: 'exp_' + Date.now(),
          ...expense,
          estimatedAmount: Number(expense.estimatedAmount) || 0,
          actualAmount: Number(expense.actualAmount) || 0,
          isPaid: Boolean(expense.isPaid),
        };
        list[idx].expenses.push(item);
        // recompute totals
        const est = list[idx].expenses.reduce((s, i) => s + (Number(i.estimatedAmount) || 0), 0);
        const act = list[idx].expenses.reduce((s, i) => s + (Number(i.actualAmount) || 0), 0);
        list[idx].totalEstimated = est;
        list[idx].totalActual = act;
        list[idx].remainingBudget = Math.max(0, list[idx].totalBudget - (act || est));
        list[idx].utilizationPercent = Math.round(((act || est) / list[idx].totalBudget) * 100);

        localStorage.setItem('venueaura_mock_budgets', JSON.stringify(list));
        return list[idx];
      }
      throw err;
    }
  },

  updateExpense: async (budgetId, expenseId, data) => {
    try {
      const res = await api.patch(`/budgets/${budgetId}/expenses/${expenseId}`, data);
      return res.data.data.budget;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_budgets');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_BUDGETS];
      const idx = list.findIndex((b) => (b._id || b.id) === budgetId);
      if (idx !== -1) {
        const expIdx = list[idx].expenses.findIndex((e) => (e._id || e.id) === expenseId);
        if (expIdx !== -1) {
          list[idx].expenses[expIdx] = { ...list[idx].expenses[expIdx], ...data };
          const est = list[idx].expenses.reduce((s, i) => s + (Number(i.estimatedAmount) || 0), 0);
          const act = list[idx].expenses.reduce((s, i) => s + (Number(i.actualAmount) || 0), 0);
          list[idx].totalEstimated = est;
          list[idx].totalActual = act;
          list[idx].remainingBudget = Math.max(0, list[idx].totalBudget - (act || est));
          list[idx].utilizationPercent = Math.round(((act || est) / list[idx].totalBudget) * 100);

          localStorage.setItem('venueaura_mock_budgets', JSON.stringify(list));
          return list[idx];
        }
      }
      throw err;
    }
  },

  deleteExpense: async (budgetId, expenseId) => {
    try {
      const res = await api.delete(`/budgets/${budgetId}/expenses/${expenseId}`);
      return res.data.data.budget;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_budgets');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_BUDGETS];
      const idx = list.findIndex((b) => (b._id || b.id) === budgetId);
      if (idx !== -1) {
        list[idx].expenses = list[idx].expenses.filter((e) => (e._id || e.id) !== expenseId);
        const est = list[idx].expenses.reduce((s, i) => s + (Number(i.estimatedAmount) || 0), 0);
        const act = list[idx].expenses.reduce((s, i) => s + (Number(i.actualAmount) || 0), 0);
        list[idx].totalEstimated = est;
        list[idx].totalActual = act;
        list[idx].remainingBudget = Math.max(0, list[idx].totalBudget - (act || est));
        list[idx].utilizationPercent = Math.round(((act || est) / list[idx].totalBudget) * 100);

        localStorage.setItem('venueaura_mock_budgets', JSON.stringify(list));
        return list[idx];
      }
      throw err;
    }
  },
};

export default budgetApi;
