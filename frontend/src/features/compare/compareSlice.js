/**
 * Compare Slice – Redux Toolkit
 *
 * Manages side-by-side comparison state for Venues and Vendors.
 * Rules:
 * - Maximum 4 items can be compared at a time per type (venues or vendors).
 * - Persistent across sessions via localStorage.
 * - Supports add, remove, toggle, clear, and item hydration.
 */

import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY_VENUES = 'venueaura_compare_venues';
const STORAGE_KEY_VENDORS = 'venueaura_compare_vendors';

// Hydrate from localStorage
const loadFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
};

const initialState = {
  venueIds: loadFromStorage(STORAGE_KEY_VENUES),
  vendorIds: loadFromStorage(STORAGE_KEY_VENDORS),
  activeTab: 'venues', // 'venues' | 'vendors'
};

const MAX_COMPARE_ITEMS = 4;

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    toggleCompareVenue: (state, action) => {
      const id = String(action.payload);
      if (state.venueIds.includes(id)) {
        state.venueIds = state.venueIds.filter((item) => item !== id);
      } else {
        if (state.venueIds.length >= MAX_COMPARE_ITEMS) {
          state.venueIds.shift(); // Remove oldest to maintain max 4
        }
        state.venueIds.push(id);
      }
      saveToStorage(STORAGE_KEY_VENUES, state.venueIds);
    },

    removeCompareVenue: (state, action) => {
      const id = String(action.payload);
      state.venueIds = state.venueIds.filter((item) => item !== id);
      saveToStorage(STORAGE_KEY_VENUES, state.venueIds);
    },

    clearCompareVenues: (state) => {
      state.venueIds = [];
      saveToStorage(STORAGE_KEY_VENUES, []);
    },

    toggleCompareVendor: (state, action) => {
      const id = String(action.payload);
      if (state.vendorIds.includes(id)) {
        state.vendorIds = state.vendorIds.filter((item) => item !== id);
      } else {
        if (state.vendorIds.length >= MAX_COMPARE_ITEMS) {
          state.vendorIds.shift();
        }
        state.vendorIds.push(id);
      }
      saveToStorage(STORAGE_KEY_VENDORS, state.vendorIds);
    },

    removeCompareVendor: (state, action) => {
      const id = String(action.payload);
      state.vendorIds = state.vendorIds.filter((item) => item !== id);
      saveToStorage(STORAGE_KEY_VENDORS, state.vendorIds);
    },

    clearCompareVendors: (state) => {
      state.vendorIds = [];
      saveToStorage(STORAGE_KEY_VENDORS, []);
    },

    setCompareTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const {
  toggleCompareVenue,
  removeCompareVenue,
  clearCompareVenues,
  toggleCompareVendor,
  removeCompareVendor,
  clearCompareVendors,
  setCompareTab,
} = compareSlice.actions;

export const selectCompareVenues = (state) => state.compare.venueIds;
export const selectCompareVendors = (state) => state.compare.vendorIds;
export const selectCompareTab = (state) => state.compare.activeTab;

export default compareSlice.reducer;
