/**
 * Bookings Redux Slice
 *
 * Manages booking list state, loading, and async actions.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingsApi from './bookingsApi';

const initialState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
};

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingsApi.getMyBookings();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id, { rejectWithValue }) => {
    try {
      return await bookingsApi.getBookingById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load booking');
    }
  }
);

export const createVenueBooking = createAsyncThunk(
  'bookings/createVenueBooking',
  async (data, { rejectWithValue }) => {
    try {
      return await bookingsApi.createVenueBooking(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Booking failed');
    }
  }
);

export const createVendorBooking = createAsyncThunk(
  'bookings/createVendorBooking',
  async (data, { rejectWithValue }) => {
    try {
      return await bookingsApi.createVendorBooking(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Enquiry failed');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      return await bookingsApi.cancelBooking(id, reason);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Cancellation failed');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyBookings
      .addCase(fetchMyBookings.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchBookingById
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
      })
      // createVenueBooking / createVendorBooking
      .addCase(createVenueBooking.fulfilled, (state, action) => {
        state.bookings.unshift(action.payload);
      })
      .addCase(createVendorBooking.fulfilled, (state, action) => {
        state.bookings.unshift(action.payload);
      })
      // cancelBooking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex(
          (b) => (b._id || b.id) === (action.payload._id || action.payload.id)
        );
        if (idx !== -1) state.bookings[idx] = action.payload;
        if (
          state.currentBooking &&
          (state.currentBooking._id || state.currentBooking.id) ===
            (action.payload._id || action.payload.id)
        ) {
          state.currentBooking = action.payload;
        }
      });
  },
});

export const { clearCurrentBooking, clearError } = bookingsSlice.actions;

export const selectAllBookings = (state) => state.bookings.bookings;
export const selectCurrentBooking = (state) => state.bookings.currentBooking;
export const selectBookingsLoading = (state) => state.bookings.isLoading;
export const selectBookingsError = (state) => state.bookings.error;

export default bookingsSlice.reducer;
