import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vendorsApi from './vendorsApi';

export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await vendorsApi.getVendors(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vendors');
    }
  }
);

export const fetchVendorDetail = createAsyncThunk(
  'vendors/fetchVendorDetail',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const response = await vendorsApi.getVendorByIdOrSlug(idOrSlug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vendor details');
    }
  }
);

const initialState = {
  vendors: [],
  selectedVendor: null,
  meta: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    category: '',
    city: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    minExperience: '',
    rating: '',
    sort: 'newest',
  },
  savedVendorIds: ['v1'],
  loading: false,
  error: null,
};

const vendorsSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setVendorFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetVendorFilters: (state) => {
      state.filters = {
        category: '',
        city: '',
        search: '',
        minPrice: '',
        maxPrice: '',
        minExperience: '',
        rating: '',
        sort: 'newest',
      };
    },
    toggleSaveVendor: (state, action) => {
      const vendorId = action.payload;
      if (state.savedVendorIds.includes(vendorId)) {
        state.savedVendorIds = state.savedVendorIds.filter(id => id !== vendorId);
      } else {
        state.savedVendorIds.push(vendorId);
      }
    },
    clearSelectedVendor: (state) => {
      state.selectedVendor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.data;
        if (action.payload.meta) {
          state.meta = action.payload.meta;
        }
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single vendor detail
      .addCase(fetchVendorDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setVendorFilters,
  resetVendorFilters,
  toggleSaveVendor,
  clearSelectedVendor,
} = vendorsSlice.actions;

export default vendorsSlice.reducer;
