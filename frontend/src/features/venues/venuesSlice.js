import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import venuesApi from './venuesApi';

export const fetchVenues = createAsyncThunk(
  'venues/fetchVenues',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await venuesApi.getVenues(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch venues');
    }
  }
);

export const fetchVenueDetail = createAsyncThunk(
  'venues/fetchVenueDetail',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const response = await venuesApi.getVenueByIdOrSlug(idOrSlug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch venue details');
    }
  }
);

const initialState = {
  venues: [],
  selectedVenue: null,
  meta: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    city: '',
    search: '',
    eventType: '',
    venueType: '',
    minPrice: '',
    maxPrice: '',
    minCapacity: '',
    rating: '',
    sort: 'newest',
  },
  savedVenueIds: ['1'],
  loading: false,
  error: null,
};

const venuesSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        city: '',
        search: '',
        eventType: '',
        venueType: '',
        minPrice: '',
        maxPrice: '',
        minCapacity: '',
        rating: '',
        sort: 'newest',
      };
    },
    toggleSaveVenue: (state, action) => {
      const venueId = action.payload;
      if (state.savedVenueIds.includes(venueId)) {
        state.savedVenueIds = state.savedVenueIds.filter(id => id !== venueId);
      } else {
        state.savedVenueIds.push(venueId);
      }
    },
    clearSelectedVenue: (state) => {
      state.selectedVenue = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch venues
      .addCase(fetchVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.venues = action.payload.data;
        if (action.payload.meta) {
          state.meta = action.payload.meta;
        }
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single venue
      .addCase(fetchVenueDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVenueDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVenue = action.payload;
      })
      .addCase(fetchVenueDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, toggleSaveVenue, clearSelectedVenue } =
  venuesSlice.actions;

export default venuesSlice.reducer;
