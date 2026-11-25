import { configureStore } from '@reduxjs/toolkit';

/**
 * Redux Store Configuration
 *
 * WHY Redux Toolkit over plain Redux:
 * - Eliminates boilerplate (createSlice vs action creators + reducers)
 * - Immer built-in (write "mutating" logic that stays immutable)
 * - RTK Query available for future data fetching if needed
 * - DevTools automatically configured
 *
 * Slices are added as features are implemented in later phases:
 * - Phase 6: authSlice (login state, user info)
 * - Phase 4: venuesSlice (venue list, filters, selected venue)
 * - Phase 5: vendorsSlice
 * - Phase 9: budgetSlice
 * - Phase 10: compareSlice
 */

import venuesReducer from '@/features/venues/venuesSlice';
import vendorsReducer from '@/features/vendors/vendorsSlice';
import authReducer from '@/features/auth/authSlice';
import eventsReducer from '@/features/events/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    venues: venuesReducer,
    vendors: vendorsReducer,
    events: eventsReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Disable serializableCheck for Date objects, etc.
      // We handle serialization ourselves where needed
      serializableCheck: false,
    }),

  // Redux DevTools is automatically enabled in development
  devTools: import.meta.env.DEV,
});

export default store;

